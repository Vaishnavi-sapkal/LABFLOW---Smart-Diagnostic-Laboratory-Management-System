import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { HealthController } from './health.controller';
import { Dashboard, DashboardSchema } from './dashboard.schema';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_dashboard'),
    MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }]),
  ],
  controllers: [DashboardController, HealthController],
  providers: [DashboardService],
})
export class DashboardModule {}
