import { isAxiosError } from 'axios';
import client from './client';

export type PatientGender = 'male' | 'female' | 'other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface CreatePatientDto {
  fullName: string;
  dateOfBirth: string;
  gender: PatientGender;
  bloodGroup?: BloodGroup;
  aadhaarNumber?: string;
  mobile: string;
  email?: string;
  city?: string;
  state?: string;
  conditions?: string[];
  allergies?: string[];
  userId?: string;
}

export interface CreatedPatient extends CreatePatientDto {
  patientId: string;
  _id?: string;
}

export async function listPatients(search?: string): Promise<CreatedPatient[]> {
  try {
    const { data } = await client.get<CreatedPatient[]>('/patients', { params: search ? { search } : undefined });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load patient profiles. Please try again.');
    }

    throw error;
  }
}

export async function createPatient(payload: CreatePatientDto): Promise<CreatedPatient> {
  try {
    const { data } = await client.post<CreatedPatient>('/patients', payload);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to register patient. Please try again.');
    }

    throw error;
  }
}
