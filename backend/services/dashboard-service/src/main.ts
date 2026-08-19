import { NestFactory } from '@nestjs/core';
import { DashboardModule } from './dashboard.module';

async function bootstrap() {
  const app = await NestFactory.create(DashboardModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
