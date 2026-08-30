import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationController } from './verification.controller';
import { HealthController } from './health.controller';
import { Verification, VerificationSchema } from './verification.schema';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_verification'),
    MongooseModule.forFeature([{ name: Verification.name, schema: VerificationSchema }]),
  ],
  controllers: [VerificationController, HealthController],
  providers: [VerificationService],
})
export class VerificationModule {}
