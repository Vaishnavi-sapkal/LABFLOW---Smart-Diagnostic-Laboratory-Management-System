import { isAxiosError } from 'axios';
import client from './client';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationDocument {
  _id: string;
  reportId: string;
  resultId: string;
  sampleId: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  technician: string;
  doctorId: string;
  priority?: string;
  submittedAt: string;
  status: VerificationStatus;
  doctorComment?: string;
  reportGenerated: boolean;
}

export async function createVerification(resultId: string, doctorId: string): Promise<VerificationDocument | null> {
  try {
    const { data } = await client.post<VerificationDocument>('/verifications', { resultId, doctorId });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 409) return null;
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to queue result for verification. Please try again.');
    }

    throw error;
  }
}

export async function listVerifications(filters?: { doctorId?: string; status?: VerificationStatus }): Promise<VerificationDocument[]> {
  try {
    const { data } = await client.get<VerificationDocument[]>('/verifications', { params: filters });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load verification queue. Please try again.');
    }

    throw error;
  }
}

export async function reviewVerification(id: string, status: 'approved' | 'rejected', doctorComment?: string): Promise<VerificationDocument> {
  try {
    const { data } = await client.patch<VerificationDocument>(`/verifications/${id}/review`, { status, doctorComment });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to review verification. Please try again.');
    }

    throw error;
  }
}
