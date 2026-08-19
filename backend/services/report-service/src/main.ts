import { NestFactory } from '@nestjs/core';
import { ReportModule } from './report.module';

async function bootstrap() {
  const app = await NestFactory.create(ReportModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
