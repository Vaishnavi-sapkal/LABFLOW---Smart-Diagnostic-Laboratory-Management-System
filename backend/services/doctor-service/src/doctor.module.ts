import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorController, HealthController } from './doctor.controller';
import { Doctor, DoctorSchema } from './doctor.schema';
import { DoctorService } from './doctor.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ uri: configService.get<string>('MONGODB_URI') }),
    }),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
  ],
  controllers: [DoctorController, HealthController],
  providers: [DoctorService],
})
export class DoctorModule {}
