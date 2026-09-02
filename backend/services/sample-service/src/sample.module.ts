import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController, SampleController } from './sample.controller';
import { Sample, SampleSchema } from './sample.schema';
import { SampleService } from './sample.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), HttpModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        serverSelectionTimeoutMS: 10000,
        retryAttempts: 5,
        retryDelay: 5000,
      }),
    }),
    MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }]),
  ],
  controllers: [SampleController, HealthController], providers: [SampleService],
})
export class SampleModule {}
