import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import { CreateVerificationDto } from './dto/create-verification.dto';
import { ReviewDto } from './dto/review.dto';
import {
  Verification,
  VerificationDocument,
  VerificationStatus,
} from './verification.schema';

type ResultSnapshot = {
  _id?: string;
  sampleId: string;
  patientId: string;
  testId: string;
  enteredBy?: string;
  submittedAt?: string | Date;
  status: string;
};

type SampleSnapshot = {
  sampleId: string;
  patientName: string;
  testDisplayName: string;
  handledBy?: string;
  priority?: string;
};

type DoctorSnapshot = { _id: string; userId?: string; email?: string; isActive?: boolean };
type PatientSnapshot = { _id: string; userId?: string; email?: string };
type NotificationPayload = {
  userId: string;
  recipientEmail?: string;
  role: 'doctor' | 'patient';
  title: string;
  message: string;
  category: 'verification' | 'report';
  priority: 'normal' | 'urgent';
  relatedEntityId: string;
  relatedEntityType: string;
};
type Actor = { userId: string; role: string };

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @InjectModel(Verification.name)
    private readonly verificationModel: Model<VerificationDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateVerificationDto, actor?: Actor) {
    const doctorId = actor?.role === 'doctor' ? await this.doctorIdForUser(actor.userId) : dto.doctorId;
    const result = await this.fetchResult(dto.resultId);

    if (result.status !== 'submitted') {
      throw new BadRequestException('Only submitted results can be sent for verification');
    }

    const doctor = await this.validateDoctor(doctorId);

    const sample = await this.fetchSample(result.sampleId);
    const reportId = this.toReportId(sample.sampleId);

    const existing = await this.verificationModel.findOne({ reportId }).exec();
    if (existing) {
      throw new ConflictException(`Verification report ${reportId} already exists`);
    }

    if (!result.submittedAt) {
      throw new BadRequestException('Submitted result is missing submittedAt');
    }

    const verification = await this.verificationModel.create({
      reportId,
      resultId: dto.resultId,
      sampleId: result.sampleId,
      patientId: result.patientId,
      patientName: sample.patientName,
      testId: result.testId,
      testName: sample.testDisplayName,
      technician: result.enteredBy ?? sample.handledBy ?? 'Unassigned',
      doctorId,
      priority: sample.priority,
      submittedAt: new Date(result.submittedAt),
      status: 'pending',
    });
    await this.sendDoctorVerificationNotification(verification, doctor);
    return verification;
  }

  async findAll(filters?: { doctorId?: string; status?: string }, actor?: Actor) {
    const query: FilterQuery<VerificationDocument> = {};
    if (actor?.role === 'doctor') query.doctorId = await this.doctorIdForUser(actor.userId);
    else if (filters?.doctorId) query.doctorId = filters.doctorId;
    if (filters?.status) query.status = filters.status;
    return this.verificationModel.find(query).sort({ submittedAt: 1 }).exec();
  }

  async findOne(id: string) {
    const verification = await this.verificationModel.findById(id).exec();
    if (!verification) throw new NotFoundException(`Verification ${id} was not found`);
    return verification;
  }

  async review(id: string, dto: ReviewDto, actor?: Actor) {
    if (dto.status === 'rejected' && !dto.doctorComment?.trim()) {
      throw new BadRequestException('doctorComment is required when rejecting a verification');
    }

    const verification = await this.findOne(id);
    await this.assertDoctorOwnership(verification, actor);
    if (verification.status !== 'pending') {
      throw new BadRequestException('Only pending verifications can be reviewed');
    }

    await this.updateResultStatus(
      verification.resultId,
      dto.status === 'approved' ? 'verified' : 'rejected',
      dto.doctorComment,
    );

    verification.status = dto.status as VerificationStatus;
    verification.doctorComment = dto.doctorComment;
    verification.reviewedAt = new Date();
    await verification.save();

    if (dto.status === 'approved') {
      const reportGenerated = await this.generateReport(verification.id);
      if (reportGenerated) {
        verification.reportGenerated = true;
        await verification.save();
        await this.sendPatientReportNotification(verification);
      }
    }

    return verification;
  }

  async remove(id: string, actor?: Actor) {
    const verification = await this.findOne(id);
    await this.assertDoctorOwnership(verification, actor);
    await verification.deleteOne();
    if (!verification) throw new NotFoundException(`Verification ${id} was not found`);
    return { deleted: true, id };
  }

  private async fetchResult(resultId: string): Promise<ResultSnapshot> {
    return this.getRemote<ResultSnapshot>('RESULT_SERVICE_URL', 'results', resultId, 'Result');
  }

  private async fetchSample(sampleId: string): Promise<SampleSnapshot> {
    return this.getRemote<SampleSnapshot>('SAMPLE_SERVICE_URL', 'samples', sampleId, 'Sample');
  }

  private async validateDoctor(doctorId: string): Promise<DoctorSnapshot> {
    const doctor = await this.getRemote<DoctorSnapshot>('DOCTOR_SERVICE_URL', 'doctors', doctorId, 'Doctor');
    if (!doctor.isActive) throw new BadRequestException(`Doctor ${doctorId} is inactive and cannot receive verifications`);
    return doctor;
  }

  private async sendDoctorVerificationNotification(verification: VerificationDocument, doctor: DoctorSnapshot) {
    if (!doctor.userId) {
      this.logger.error(`Notification not created for verification ${verification.id}: doctor profile ${verification.doctorId} has no linked auth userId`);
      return;
    }
    await this.sendNotification({
      userId: doctor.userId,
      recipientEmail: doctor.email,
      role: 'doctor',
      title: 'Result awaiting verification',
      message: `${verification.testName} result for ${verification.patientName} is awaiting your verification.`,
      category: 'verification',
      priority: verification.priority === 'urgent' ? 'urgent' : 'normal',
      relatedEntityId: verification.id,
      relatedEntityType: 'verification',
    });
  }

  private async sendPatientReportNotification(verification: VerificationDocument) {
    let patient: PatientSnapshot;
    try {
      patient = await this.getRemote<PatientSnapshot>('PATIENT_SERVICE_URL', 'patients', verification.patientId, 'Patient');
    } catch (error) {
      this.logger.error(`Patient notification could not resolve recipient for verification ${verification.id}`, error instanceof Error ? error.stack : String(error));
      return;
    }
    if (!patient.userId) {
      this.logger.warn(`Patient notification skipped for verification ${verification.id}: patient profile ${verification.patientId} has no linked auth userId`);
      return;
    }
    await this.sendNotification({
      userId: patient.userId,
      recipientEmail: patient.email,
      role: 'patient',
      title: 'Report ready',
      message: `Your laboratory report for ${verification.testName} is ready for download.`,
      category: 'report',
      priority: 'normal',
      relatedEntityId: verification.id,
      relatedEntityType: 'verification',
    });
  }

  private async sendNotification(payload: NotificationPayload) {
    const baseUrl = this.getBaseUrl('NOTIFICATION_SERVICE_URL');
    this.logger.log(`Creating ${payload.role} notification: userId=${payload.userId}, recipientEmail=${payload.recipientEmail ?? 'none'}, relatedEntityId=${payload.relatedEntityId}`);
    try {
      await firstValueFrom(this.httpService.post(`${baseUrl}/notifications`, payload, { headers: this.internalHeaders() }));
      this.logger.log(`${payload.role} notification accepted for userId=${payload.userId}`);
    } catch (error) {
      this.logger.error(`${payload.role} notification failed for userId=${payload.userId}`, error instanceof Error ? error.stack : String(error));
    }
  }

  private async updateResultStatus(
    resultId: string,
    status: 'verified' | 'rejected',
    comment?: string,
  ): Promise<void> {
    const baseUrl = this.getBaseUrl('RESULT_SERVICE_URL');
    try {
      await firstValueFrom(
        this.httpService.patch(`${baseUrl}/results/${resultId}/status`, { status, comment }, { headers: this.internalHeaders() }),
      );
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new NotFoundException(`Result ${resultId} was not found`);
      }
      if (error?.response?.status === 400) {
        throw new BadRequestException(error.response.data?.message ?? 'Result status could not be updated');
      }
      throw new ServiceUnavailableException('Unable to update result status');
    }
  }

  private async generateReport(verificationId: string): Promise<boolean> {
    try {
      const baseUrl = this.getBaseUrl('REPORT_SERVICE_URL');
      await firstValueFrom(
        this.httpService.post(`${baseUrl}/reports`, { verificationId }, { headers: this.internalHeaders() }),
      );
      return true;
    } catch (error: any) {
      this.logger.error(
        `Unable to generate report for verification ${verificationId}`,
        error instanceof Error ? error.stack : undefined,
      );
      return false;
    }
  }

  private async getRemote<T>(
    configKey: string,
    resourcePath: string,
    id: string,
    resourceName: string,
  ): Promise<T> {
    const baseUrl = this.getBaseUrl(configKey);
    try {
      const response = await firstValueFrom(this.httpService.get<T>(`${baseUrl}/${resourcePath}/${id}`, { headers: this.internalHeaders() }));
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new NotFoundException(`${resourceName} ${id} was not found`);
      }
      throw new ServiceUnavailableException(`Unable to retrieve ${resourceName.toLowerCase()} from its service`);
    }
  }

  private getBaseUrl(configKey: string) {
    const baseUrl = this.configService.get<string>(configKey);
    if (!baseUrl) throw new ServiceUnavailableException(`${configKey} is not configured`);
    return baseUrl.replace(/\/$/, '');
  }

  private async doctorIdForUser(userId: string): Promise<string> {
    const baseUrl = this.getBaseUrl('DOCTOR_SERVICE_URL');
    try {
      const doctors = (await firstValueFrom(this.httpService.get<DoctorSnapshot[]>(`${baseUrl}/doctors`, { headers: this.internalHeaders() }))).data;
      const doctor = doctors.find((item) => item.userId === userId && item.isActive !== false);
      if (!doctor) throw new ForbiddenException('Your account is not linked to a doctor profile');
      return doctor._id;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new ServiceUnavailableException('Unable to validate the doctor profile');
    }
  }

  private async assertDoctorOwnership(verification: VerificationDocument, actor?: Actor) {
    if (!actor || actor.role === 'admin') return;
    if (actor.role !== 'doctor' || verification.doctorId !== await this.doctorIdForUser(actor.userId)) {
      throw new ForbiddenException('You may only access verifications assigned to your doctor profile');
    }
  }

  private internalHeaders() {
    const secret = this.configService.get<string>('INTERNAL_SERVICE_SECRET');
    if (!secret) throw new ServiceUnavailableException('INTERNAL_SERVICE_SECRET is not configured');
    return { 'x-internal-service-key': secret };
  }

  private toReportId(sampleId: string) {
    const suffix = sampleId.match(/^SMP-(\d{4}-\d{3})$/)?.[1];
    if (!suffix) throw new BadRequestException(`Invalid sample ID format: ${sampleId}`);
    return `LF-${suffix}`;
  }
}
