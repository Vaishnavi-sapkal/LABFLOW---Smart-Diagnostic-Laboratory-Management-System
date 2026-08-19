import { NestFactory } from '@nestjs/core';
import { SampleModule } from './sample.module';

async function bootstrap() {
  const app = await NestFactory.create(SampleModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
