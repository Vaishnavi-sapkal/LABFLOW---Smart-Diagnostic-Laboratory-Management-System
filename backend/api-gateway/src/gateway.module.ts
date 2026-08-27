import { Controller, Get, Module } from '@nestjs/common';

export const serviceRoutes = [
  { prefix: 'auth', env: 'AUTH_SERVICE_URL', defaultUrl: 'http://localhost:3001' },
  { prefix: 'patient', env: 'PATIENT_SERVICE_URL', defaultUrl: 'http://localhost:3002' },
  { prefix: 'sample', env: 'SAMPLE_SERVICE_URL', defaultUrl: 'http://localhost:3003' },
  { prefix: 'test', env: 'TEST_SERVICE_URL', defaultUrl: 'http://localhost:3004' },
  { prefix: 'result', env: 'RESULT_SERVICE_URL', defaultUrl: 'http://localhost:3005' },
  { prefix: 'report', env: 'REPORT_SERVICE_URL', defaultUrl: 'http://localhost:3006' },
  { prefix: 'booking', env: 'BOOKING_SERVICE_URL', defaultUrl: 'http://localhost:3007' },
  { prefix: 'doctor', env: 'DOCTOR_SERVICE_URL', defaultUrl: 'http://localhost:3008' },
  { prefix: 'billing', env: 'BILLING_SERVICE_URL', defaultUrl: 'http://localhost:3009' },
  { prefix: 'verification', env: 'VERIFICATION_SERVICE_URL', defaultUrl: 'http://localhost:3010' },
  { prefix: 'notification', env: 'NOTIFICATION_SERVICE_URL', defaultUrl: 'http://localhost:3011' },
  { prefix: 'dashboard', env: 'DASHBOARD_SERVICE_URL', defaultUrl: 'http://localhost:3012' },
] as const;

@Controller('health')
class GatewayHealthController {
  @Get()
  async health() {
    const services = await Promise.all(serviceRoutes.map(async (route) => {
      const url = process.env[route.env] ?? route.defaultUrl;
      try {
        const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
        return { service: route.prefix, status: response.ok ? 'ok' : 'unavailable' };
      } catch {
        return { service: route.prefix, status: 'unavailable' };
      }
    }));
    return { status: services.every((service) => service.status === 'ok') ? 'ok' : 'degraded', services };
  }
}

@Module({ controllers: [GatewayHealthController] })
export class GatewayModule {}
