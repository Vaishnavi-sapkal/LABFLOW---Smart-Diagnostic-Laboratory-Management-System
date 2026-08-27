import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './report.controller';
import { HealthController } from './health.controller';
import { Report, ReportSchema } from './report.schema';
import { ReportService } from './report.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_report'),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  controllers: [ReportController, HealthController],
  providers: [ReportService],
})
export class ReportModule {}
