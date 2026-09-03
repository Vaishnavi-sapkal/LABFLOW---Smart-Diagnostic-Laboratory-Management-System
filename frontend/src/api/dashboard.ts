import { isAxiosError } from 'axios';
import client from './client';

export type DashboardPeriod = 'today' | 'week' | 'month';

export interface DashboardResponse {
  summary: {
    period: DashboardPeriod;
    totalPatientsToday: number;
    testsBookedToday: number;
    revenueToday: number;
    pendingResults: number;
  };
  testTrends: { period: DashboardPeriod; data: Array<{ test: string; count: number }> };
  alerts: Array<{ title: string; count: number; severity: string; type: string }>;
  recentActivity: unknown[];
}

export async function getDashboard(period: DashboardPeriod): Promise<DashboardResponse> {
  try {
    const { data } = await client.get<DashboardResponse>('/dashboard', { params: { period } });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to load dashboard data. Please try again.');
    }

    throw error;
  }
}
