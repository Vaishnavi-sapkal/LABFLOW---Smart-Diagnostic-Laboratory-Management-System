import { NestFactory } from '@nestjs/core';
import { PatientModule } from './patient.module';

async function bootstrap() {
  const app = await NestFactory.create(PatientModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
