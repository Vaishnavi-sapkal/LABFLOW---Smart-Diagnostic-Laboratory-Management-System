import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Module({})
class GatewayModule {}

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
