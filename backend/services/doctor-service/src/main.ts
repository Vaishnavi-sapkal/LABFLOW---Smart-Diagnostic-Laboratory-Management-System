import { NestFactory } from '@nestjs/core';
import { DoctorModule } from './doctor.module';

async function bootstrap() {
  const app = await NestFactory.create(DoctorModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
