import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingController } from './billing.controller';
import { HealthController } from './health.controller';
import { Billing, BillingSchema } from './billing.schema';
import { BillingService } from './billing.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_billing'),
    MongooseModule.forFeature([{ name: Billing.name, schema: BillingSchema }]),
  ],
  controllers: [BillingController, HealthController],
  providers: [BillingService],
})
export class BillingModule {}
