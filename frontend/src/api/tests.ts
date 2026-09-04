import { isAxiosError } from 'axios';
import client from './client';

export interface TestDocument {
  _id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  turnaroundHours: number;
  method?: string;
  fastingRequired?: boolean;
  isPackage?: boolean;
  includedTestIds?: string[];
  parameters?: Array<{
    name: string;
    unit: string;
    referenceMin: number;
    referenceMax: number;
  }>;
}

export interface TestParameterDto {
  name: string;
  unit: string;
  referenceMin: number;
  referenceMax: number;
}

export interface CreateTestDto {
  name: string;
  code: string;
  category: string;
  price: number;
  turnaroundHours: number;
  method?: string;
  fastingRequired?: boolean;
  isPackage?: boolean;
  includedTestIds?: string[];
  parameters?: TestParameterDto[];
}

export type UpdateTestDto = Partial<CreateTestDto>;

export interface PackageSavings {
  individualTotal: number;
  packagePrice: number;
  savings: number;
}

export async function listTests(): Promise<TestDocument[]> {
  try {
    const { data } = await client.get<TestDocument[]>('/tests');
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load tests. Please try again.');
    }

    throw error;
  }
}

export async function createTest(payload: CreateTestDto): Promise<TestDocument> {
  try {
    const { data } = await client.post<TestDocument>('/tests', payload);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to create test. Please try again.');
    }

    throw error;
  }
}

export async function updateTest(id: string, payload: UpdateTestDto): Promise<TestDocument> {
  try {
    const { data } = await client.patch<TestDocument>(`/tests/${id}`, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to update test. Please try again.');
    }

    throw error;
  }
}

export async function deleteTest(id: string): Promise<unknown> {
  try {
    const { data } = await client.delete(`/tests/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to delete test. Please try again.');
    }

    throw error;
  }
}

export async function getSavings(id: string): Promise<PackageSavings> {
  try {
    const { data } = await client.get<PackageSavings>(`/tests/${id}/savings`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load package savings. Please try again.');
    }

    throw error;
  }
}
