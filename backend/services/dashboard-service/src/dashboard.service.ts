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

  private periodStart(period: string): Date {
    const now = new Date();
    const start = new Date(now);

    if (period === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      start.setDate(start.getDate() - 7);
    } else {
      start.setDate(start.getDate() - 30);
    }

    return start;
  }

  private inPeriod(items: any[], period: string): any[] {
    const start = this.periodStart(period).getTime();
    return items.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return !Number.isNaN(createdAt) && createdAt >= start;
    });
  }

  private async fetchSamples(): Promise<any[]> {
    try {
      const response = await fetch(`${this.configService.get('SAMPLE_SERVICE_URL')}/samples`);
      if (!response.ok) return [];
      const grouped = await response.json();
      if (Array.isArray(grouped)) return grouped;
      return Object.values(grouped).flatMap((samples) => Array.isArray(samples) ? samples : []);
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

    const periodPatients = this.inPeriod(patients, period);
    const periodBookings = this.inPeriod(bookings, period);
    const periodBilling = this.inPeriod(billing, period);
    const periodResults = this.inPeriod(results, period);

    return {
      period,
      totalPatientsToday: periodPatients.length,
      testsBookedToday: periodBookings.length,
      revenueToday: periodBilling
        .filter((item) => item.status === 'paid')
        .reduce(
        (sum, item) => sum + Number(item.totalAmount || 0),
        0,
      ),
      pendingResults: periodResults.filter(
        (item) => item.status === 'draft' || item.status === 'submitted',
      ).length,
    };
  }

  async getTestTrends(period: string) {
    const bookings = await this.fetchData(
      `${this.configService.get('BOOKING_SERVICE_URL')}/bookings`,
    );

    const testCounts: Record<string, number> = {};

    for (const booking of this.inPeriod(bookings, period)) {
      for (const item of booking.items || []) {
        const testName = item.name || item.code || 'Unknown';
        testCounts[testName] = (testCounts[testName] || 0) + 1;
      }
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
    const [results, samples, verifications] = await Promise.all([
      this.fetchData(`${this.configService.get('RESULT_SERVICE_URL')}/results`),
      this.fetchSamples(),
      this.fetchData(`${this.configService.get('VERIFICATION_SERVICE_URL')}/verifications`),
    ]);
    const overdueThreshold = Date.now() - (24 * 60 * 60 * 1000);

    return [
      {
        title: 'Results awaiting entry',
        count: results.filter((r) => r.status === 'draft').length,
        severity: 'warning',
        type: 'result',
      },
      {
        title: 'Samples overdue',
        count: samples.filter((sample) =>
          (sample.status === 'collected' || sample.status === 'in-transit') &&
          new Date(sample.statusUpdatedAt).getTime() < overdueThreshold,
        ).length,
        severity: 'urgent',
        type: 'sample',
      },
      {
        title: 'Verifications awaiting review',
        count: verifications.filter((verification) => verification.status === 'pending').length,
        severity: 'warning',
        type: 'verification',
      },
    ];
  }

  async getRecentActivity() {
    const [samples, bookings] = await Promise.all([
      this.fetchSamples(),
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
        sampleId: item.sampleId || item.bookingId || item._id,
        patientId: item.patientId,
        patientName: item.patientName,
        testName: item.testDisplayName || item.items?.map((test: any) => test.name).join(', '),
        // Samples do not retain doctor information; avoid an extra doctor-service
        // lookup here to keep this latency-sensitive activity feed lightweight.
        assignedDoctor: item.items ? item.doctorId : undefined,
        status: item.status,
        time: item.updatedAt || item.createdAt,
        amount: item.items ? item.totalAmount || 0 : 0,
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
