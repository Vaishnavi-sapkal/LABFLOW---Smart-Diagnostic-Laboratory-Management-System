import { isAxiosError } from "axios";
import client from "./client";

export interface ResultValue {
  parameterName: string;
  value: number | null;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  flag: "pending" | "normal" | "low" | "high";
}

export interface CreateResultDto {
  sampleId: string;
  bookingId: string;
  patientId: string;
  testId: string;
  doctorId?: string;
  enteredBy?: string;
}

export interface UpdateValuesDto {
  values: Array<{
    parameterName: string;
    value: number;
  }>;
}

export interface UpdateRemarksDto {
  remarks: string;
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
  status: "draft" | "submitted" | "verified" | "rejected";
  enteredBy?: string;
  submittedAt?: string;
  abnormalValues?: ResultValue[];
}

function messageFrom(error: unknown, fallback: string): never {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    throw new Error(typeof message === "string" ? message : fallback);
  }

  throw error;
}

export async function listResults(filters?: {
  status?: string;
}): Promise<ResultDocument[]> {
  try {
    const { data } = await client.get<ResultDocument[]>("/results", {
      params: filters,
    });
    return data;
  } catch (error) {
    return messageFrom(error, "Unable to load results. Please try again.");
  }
}

export async function getResult(id: string): Promise<ResultDocument> {
  try {
    const { data } = await client.get<ResultDocument>(`/results/${id}`);
    return data;
  } catch (error) {
    return messageFrom(
      error,
      "Unable to load result details. Please try again.",
    );
  }
}

export async function createResult(
  payload: CreateResultDto,
): Promise<ResultDocument> {
  try {
    const { data } = await client.post<ResultDocument>("/results", payload);
    return data;
  } catch (error) {
    return messageFrom(error, "Unable to create result. Please try again.");
  }
}

export async function updateValues(
  id: string,
  payload: UpdateValuesDto,
): Promise<ResultDocument> {
  try {
    const { data } = await client.patch<ResultDocument>(
      `/results/${id}/values`,
      payload,
    );
    return data;
  } catch (error) {
    return messageFrom(
      error,
      "Unable to update result values. Please try again.",
    );
  }
}

export async function updateRemarks(
  id: string,
  payload: UpdateRemarksDto,
): Promise<ResultDocument> {
  try {
    const { data } = await client.patch<ResultDocument>(
      `/results/${id}/remarks`,
      payload,
    );
    return data;
  } catch (error) {
    return messageFrom(
      error,
      "Unable to update result remarks. Please try again.",
    );
  }
}

export async function submitResult(id: string): Promise<ResultDocument> {
  try {
    const { data } = await client.post<ResultDocument>(`/results/${id}/submit`);
    return data;
  } catch (error) {
    return messageFrom(error, "Unable to submit result. Please try again.");
  }
}
