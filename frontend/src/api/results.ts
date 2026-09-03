import { isAxiosError } from 'axios';
import client from './client';

export interface ResultValue {
  parameterName: string;
  value: number | null;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  flag: 'pending' | 'normal' | 'low' | 'high';
}

export interface ResultDocument {
  _id: string;
  sampleId: string;
  bookingId: string;
  patientId: string;
  testId: string;
  doctorId?: string;
  values: ResultValue[];
  remarks?: string;
  status: 'draft' | 'submitted' | 'verified' | 'rejected';
  enteredBy?: string;
  submittedAt?: string;
  abnormalValues?: ResultValue[];
}

export async function listResults(filters?: { status?: string }): Promise<ResultDocument[]> {
  try {
    const { data } = await client.get<ResultDocument[]>('/results', { params: filters });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load results. Please try again.');
    }

    throw error;
  }
}

export async function getResult(id: string): Promise<ResultDocument> {
  try {
    const { data } = await client.get<ResultDocument>(`/results/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load result details. Please try again.');
    }

    throw error;
  }
}
