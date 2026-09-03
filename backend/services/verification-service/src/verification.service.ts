import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
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

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @InjectModel(Verification.name)
    private readonly verificationModel: Model<VerificationDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateVerificationDto) {
    const result = await this.fetchResult(dto.resultId);

    if (result.status !== 'submitted') {
      throw new BadRequestException('Only submitted results can be sent for verification');
    }

    await this.validateDoctor(dto.doctorId);

    const sample = await this.fetchSample(result.sampleId);
    const reportId = this.toReportId(sample.sampleId);

    const existing = await this.verificationModel.findOne({ reportId }).exec();
    if (existing) {
      throw new ConflictException(`Verification report ${reportId} already exists`);
    }

    if (!result.submittedAt) {
      throw new BadRequestException('Submitted result is missing submittedAt');
    }

    return this.verificationModel.create({
      reportId,
      resultId: dto.resultId,
      sampleId: result.sampleId,
      patientId: result.patientId,
      patientName: sample.patientName,
      testId: result.testId,
      testName: sample.testDisplayName,
      technician: result.enteredBy ?? sample.handledBy ?? 'Unassigned',
      doctorId: dto.doctorId,
      priority: sample.priority,
      submittedAt: new Date(result.submittedAt),
      status: 'pending',
    });
  }

  findAll(filters?: { doctorId?: string; status?: string }) {
    const query: FilterQuery<VerificationDocument> = {};
    if (filters?.doctorId) query.doctorId = filters.doctorId;
    if (filters?.status) query.status = filters.status;
    return this.verificationModel.find(query).sort({ submittedAt: 1 }).exec();
  }

  async findOne(id: string) {
    const verification = await this.verificationModel.findById(id).exec();
    if (!verification) throw new NotFoundException(`Verification ${id} was not found`);
    return verification;
  }

  async review(id: string, dto: ReviewDto) {
    if (dto.status === 'rejected' && !dto.doctorComment?.trim()) {
      throw new BadRequestException('doctorComment is required when rejecting a verification');
    }

    const verification = await this.findOne(id);
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
      }
    }

    return verification;
  }

  async remove(id: string) {
    const verification = await this.verificationModel.findByIdAndDelete(id).exec();
    if (!verification) throw new NotFoundException(`Verification ${id} was not found`);
    return { deleted: true, id };
  }

  private async fetchResult(resultId: string): Promise<ResultSnapshot> {
    return this.getRemote<ResultSnapshot>('RESULT_SERVICE_URL', 'results', resultId, 'Result');
  }

  private async fetchSample(sampleId: string): Promise<SampleSnapshot> {
    return this.getRemote<SampleSnapshot>('SAMPLE_SERVICE_URL', 'samples', sampleId, 'Sample');
  }

  private async validateDoctor(doctorId: string): Promise<void> {
    await this.getRemote('DOCTOR_SERVICE_URL', 'doctors', doctorId, 'Doctor');
  }

  private async updateResultStatus(
    resultId: string,
    status: 'verified' | 'rejected',
    comment?: string,
  ): Promise<void> {
    const baseUrl = this.getBaseUrl('RESULT_SERVICE_URL');
    try {
      await firstValueFrom(
        this.httpService.patch(`${baseUrl}/results/${resultId}/status`, { status, comment }),
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
        this.httpService.post(`${baseUrl}/reports`, { verificationId }),
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
      const response = await firstValueFrom(this.httpService.get<T>(`${baseUrl}/${resourcePath}/${id}`));
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

  private toReportId(sampleId: string) {
    const suffix = sampleId.match(/^SMP-(\d{4}-\d{3})$/)?.[1];
    if (!suffix) throw new BadRequestException(`Invalid sample ID format: ${sampleId}`);
    return `LF-${suffix}`;
  }
}
