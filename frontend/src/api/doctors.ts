import { isAxiosError } from 'axios';
import client from './client';

export interface DoctorDocument {
  _id: string;
  fullName: string;
  specialization?: string;
  qualification?: string;
  mobile?: string;
  email?: string;
  isActive?: boolean;
  userId?: string;
}

export async function listDoctors(): Promise<DoctorDocument[]> {
  try {
    const { data } = await client.get<DoctorDocument[]>('/doctors');
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load doctors. Please try again.');
    }

    throw error;
  }
}

export async function getDoctor(id: string): Promise<DoctorDocument> {
  try {
    const { data } = await client.get<DoctorDocument>(`/doctors/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load doctor details. Please try again.');
    }

    throw error;
  }
}
