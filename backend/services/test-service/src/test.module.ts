import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController, TestController } from './test.controller';
import { Test, TestSchema } from './test.schema';
import { TestService } from './test.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestController, HealthController],
  providers: [TestService],
})
export class TestModule {}
