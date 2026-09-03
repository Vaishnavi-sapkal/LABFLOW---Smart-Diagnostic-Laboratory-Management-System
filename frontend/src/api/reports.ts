import { isAxiosError } from 'axios';
import client from './client';

export interface ReportValue {
  parameterName: string;
  value: number | null;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  flag: string;
}

export interface ReportDocument {
  _id: string;
  reportNo: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientDisplayId: string;
  sampleType: string;
  collectionDate: string;
  reportDate: string;
  testName: string;
  testMethod: string;
  allNormal: boolean;
  values: ReportValue[];
  doctorName: string;
  doctorQualification?: string;
  doctorRegistrationNumber?: string;
  clinicalRemarks?: string;
  verifiedAt: string;
  verificationUrl: string;
  sampleId: string;
  resultId: string;
  verificationId: string;
}

function rethrowApiError(error: unknown, fallback: string): never {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    throw new Error(typeof message === 'string' ? message : fallback);
  }

  throw error;
}

export async function listReports(filters?: { patientId?: string; doctorId?: string }): Promise<ReportDocument[]> {
  try {
    const { data } = await client.get<ReportDocument[]>('/reports', { params: filters });
    return data;
  } catch (error) {
    return rethrowApiError(error, 'Unable to load reports. Please try again.');
  }
}

export async function getReport(id: string): Promise<ReportDocument> {
  try {
    const { data } = await client.get<ReportDocument>(`/reports/${id}`);
    return data;
  } catch (error) {
    return rethrowApiError(error, 'Unable to load report. Please try again.');
  }
}

export async function getReportByNo(reportNo: string): Promise<ReportDocument> {
  try {
    const { data } = await client.get<ReportDocument>(`/reports/by-report-no/${encodeURIComponent(reportNo)}`);
    return data;
  } catch (error) {
    return rethrowApiError(error, 'Unable to load report. Please try again.');
  }
}
