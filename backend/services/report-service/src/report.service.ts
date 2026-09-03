import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import { CreateReportDto } from './dto/create-report.dto';
import { Report, ReportDocument, ReportValue } from './report.schema';

type VerificationSnapshot = { resultId: string; sampleId: string; patientId: string; doctorId: string; testName: string; doctorComment?: string; reviewedAt?: Date | string; status: string };
type ResultValueSnapshot = { parameterName: string; value: number | null; unit: string; referenceMin: number; referenceMax: number; flag: string };
type ResultSnapshot = { values: ResultValueSnapshot[] };
type SampleSnapshot = { sampleType?: string; collectedAt?: Date | string };
type PatientSnapshot = { patientId: string; fullName: string; dateOfBirth?: Date | string; gender?: string };
type DoctorSnapshot = { fullName: string; qualification?: string; registrationNumber?: string };

const LAB = {
  name: 'LabFlow Diagnostics',
  accreditation: 'NABL Accredited · ISO 15189:2022 Certified',
  address: '123 Health Avenue, New Delhi, India',
  phone: '+91 11 4000 0000',
  website: 'https://labflow.in',
} as const;

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateReportDto) {
    const verification = await this.getRemote<VerificationSnapshot>('VERIFICATION_SERVICE_URL', 'verifications', dto.verificationId, 'Verification');
    if (verification.status !== 'approved') throw new NotFoundException(`Approved verification ${dto.verificationId} was not found`);
    if (!verification.reviewedAt) throw new BadRequestException('Approved verification is missing reviewedAt');

    const existing = await this.reportModel.findOne({ verificationId: dto.verificationId }).exec();
    if (existing) return existing;

    const [result, sample, patient, doctor] = await Promise.all([
      this.getRemote<ResultSnapshot>('RESULT_SERVICE_URL', 'results', verification.resultId, 'Result'),
      this.getRemote<SampleSnapshot>('SAMPLE_SERVICE_URL', 'samples', verification.sampleId, 'Sample'),
      this.getRemote<PatientSnapshot>('PATIENT_SERVICE_URL', 'patients', verification.patientId, 'Patient'),
      this.getRemote<DoctorSnapshot>('DOCTOR_SERVICE_URL', 'doctors', verification.doctorId, 'Doctor'),
    ]);

    if (!sample.sampleType || !sample.collectedAt) throw new BadRequestException('Sample is missing sampleType or collectedAt');
    const reportDate = new Date();
    const values = result.values as ReportValue[];
    const report = {
      verificationId: dto.verificationId, resultId: verification.resultId, sampleId: verification.sampleId,
      patientId: verification.patientId, doctorId: verification.doctorId,
      patientName: patient.fullName, patientAge: this.ageOn(patient.dateOfBirth, reportDate), patientGender: patient.gender,
      patientDisplayId: patient.patientId, sampleType: sample.sampleType, collectionDate: new Date(sample.collectedAt), reportDate,
      testName: verification.testName, testMethod: 'Automated Analyzer', allNormal: values.every((value) => value.flag === 'normal'), values,
      doctorName: doctor.fullName, doctorQualification: doctor.qualification, doctorRegistrationNumber: doctor.registrationNumber,
      clinicalRemarks: verification.doctorComment, verifiedAt: new Date(verification.reviewedAt),
    };

    // Report numbers use the latest number for the current month; the unique index
    // is the final guard, and a duplicate collision is retried once.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const reportNo = await this.nextReportNo(reportDate);
      try {
        return await this.reportModel.create({ ...report, reportNo, verificationUrl: `https://labflow.in/verify/${reportNo}` });
      } catch (error: any) {
        if (error?.code === 11000 && attempt === 0) continue;
        if (error?.code === 11000) throw new ConflictException('Could not generate a unique report number');
        throw error;
      }
    }
    throw new ConflictException('Could not generate a unique report number');
  }

  findAll(filters?: { patientId?: string; doctorId?: string }) {
    const query: FilterQuery<ReportDocument> = {};
    if (filters?.patientId) query.patientId = filters.patientId;
    if (filters?.doctorId) query.doctorId = filters.doctorId;
    return this.reportModel.find(query).sort({ reportDate: -1 }).exec();
  }

  async findOne(id: string) {
    const report = await this.reportModel.findById(id).exec();
    if (!report) throw new NotFoundException(`Report ${id} was not found`);
    return report;
  }

  async findByReportNo(reportNo: string) {
    const report = await this.reportModel.findOne({ reportNo }).exec();
    if (!report) throw new NotFoundException(`Report ${reportNo} was not found`);
    return report;
  }

  async verify(reportNo: string) {
    const report = await this.reportModel.findOne({ reportNo }).exec();
    if (!report) return null;
    return { valid: true, reportNo: report.reportNo, patientName: report.patientName, testName: report.testName, reportDate: report.reportDate };
  }

  async remove(id: string) {
    const report = await this.reportModel.findByIdAndDelete(id).exec();
    if (!report) throw new NotFoundException(`Report ${id} was not found`);
    return { deleted: true, id };
  }

  private async getRemote<T>(configKey: string, resourcePath: string, id: string, resource: string): Promise<T> {
    const baseUrl = this.getBaseUrl(configKey);
    try { return (await firstValueFrom(this.httpService.get<T>(`${baseUrl}/${resourcePath}/${id}`))).data; }
    catch (error: any) {
      if (error?.response?.status === 404) throw new NotFoundException(`${resource} ${id} was not found`);
      throw new ServiceUnavailableException(`Unable to retrieve ${resource.toLowerCase()} from its service`);
    }
  }

  private getBaseUrl(configKey: string) {
    const baseUrl = this.configService.get<string>(configKey);
    if (!baseUrl) throw new ServiceUnavailableException(`${configKey} is not configured`);
    return baseUrl.replace(/\/$/, '');
  }

  private ageOn(dateOfBirth: Date | string | undefined, onDate: Date) {
    if (!dateOfBirth) return undefined;
    const birth = new Date(dateOfBirth);
    let age = onDate.getFullYear() - birth.getFullYear();
    const month = onDate.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && onDate.getDate() < birth.getDate())) age -= 1;
    return age;
  }

  private async nextReportNo(date: Date) {
    const month = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const prefix = `LF-RPT-${month}-`;
    const latest = await this.reportModel.findOne({ reportNo: new RegExp(`^${prefix}`) }).sort({ reportNo: -1 }).select('reportNo').lean().exec();
    const sequence = latest ? Number(latest.reportNo.slice(-3)) + 1 : 1;
    if (sequence > 999) throw new ConflictException(`Monthly report limit reached for ${month}`);
    return `${prefix}${String(sequence).padStart(3, '0')}`;
  }

  getLabHeader() { return LAB; }
}
