import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum DashboardPeriod {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
}

export class DashboardQueryDto {
  @ApiPropertyOptional({
    enum: DashboardPeriod,
    default: DashboardPeriod.TODAY,
  })
  @IsOptional()
  @IsEnum(DashboardPeriod)
  period: DashboardPeriod = DashboardPeriod.TODAY;
}