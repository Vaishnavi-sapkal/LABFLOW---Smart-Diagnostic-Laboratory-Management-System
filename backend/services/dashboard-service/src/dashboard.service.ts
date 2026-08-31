import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DashboardService {
  constructor(private readonly configService: ConfigService) {}

  private async fetchData(url: string): Promise<any[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch {
      return [];
    }
  }

  async getSummary(period: string) {
    const [patients, bookings, billing, results] = await Promise.all([
      this.fetchData(`${this.configService.get('PATIENT_SERVICE_URL')}/patients`),
      this.fetchData(`${this.configService.get('BOOKING_SERVICE_URL')}/bookings`),
      this.fetchData(`${this.configService.get('BILLING_SERVICE_URL')}/billing`),
      this.fetchData(`${this.configService.get('RESULT_SERVICE_URL')}/results`),
    ]);

    return {
      period,
      totalPatientsToday: patients.length,
      testsBookedToday: bookings.length,
      revenueToday: billing.reduce(
        (sum, item) => sum + Number(item.amount || item.totalAmount || 0),
        0,
      ),
      pendingResults: results.filter(
        (item) => item.status === 'draft' || item.status === 'pending',
      ).length,
    };
  }

  async getTestTrends(period: string) {
    const bookings = await this.fetchData(
      `${this.configService.get('BOOKING_SERVICE_URL')}/bookings`,
    );

    const testCounts: Record<string, number> = {};

    for (const booking of bookings) {
      const testName =
        booking.testName || booking.test?.name || booking.testId || 'Unknown';

      testCounts[testName] = (testCounts[testName] || 0) + 1;
    }

    return {
      period,
      data: Object.entries(testCounts).map(([test, count]) => ({
        test,
        count,
      })),
    };
  }

  async getAlerts() {
    const [results, samples, reports] = await Promise.all([
      this.fetchData(`${this.configService.get('RESULT_SERVICE_URL')}/results`),
      this.fetchData(`${this.configService.get('SAMPLE_SERVICE_URL')}/samples`),
      this.fetchData(`${this.configService.get('REPORT_SERVICE_URL')}/reports`),
    ]);

    return [
      {
        title: 'Results awaiting entry',
        count: results.filter(
          (r) => r.status === 'draft' || r.status === 'pending',
        ).length,
        severity: 'warning',
        type: 'result',
      },
      {
        title: 'Samples overdue',
        count: samples.filter(
          (s) => s.status === 'pending' || s.status === 'collected_pending',
        ).length,
        severity: 'urgent',
        type: 'sample',
      },
      {
        title: 'Reports ready for sign-off',
        count: reports.filter(
          (r) => r.status === 'ready' || r.status === 'pending_signoff',
        ).length,
        severity: 'warning',
        type: 'report',
      },
    ];
  }

  async getRecentActivity() {
    const [samples, bookings] = await Promise.all([
      this.fetchData(`${this.configService.get('SAMPLE_SERVICE_URL')}/samples`),
      this.fetchData(`${this.configService.get('BOOKING_SERVICE_URL')}/bookings`),
    ]);

    const activities = [...samples, ...bookings];

    return activities
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.createdAt || 0).getTime(),
      )
      .slice(0, 10)
      .map((item) => ({
        sampleId: item.sampleId || item._id,
        patientId: item.patientId,
        patientName: item.patientName,
        testName: item.testName || item.test?.name,
        assignedDoctor: item.doctorName || item.doctorId,
        status: item.status,
        time: item.updatedAt || item.createdAt,
        amount: item.amount || item.totalAmount || 0,
      }));
  }

  async getDashboard(period: string) {
    const [summary, testTrends, alerts, recentActivity] = await Promise.all([
      this.getSummary(period),
      this.getTestTrends(period),
      this.getAlerts(),
      this.getRecentActivity(),
    ]);

    return {
      summary,
      testTrends,
      alerts,
      recentActivity,
    };
  }
}