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
