import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { JwtAuthGuard, Public, Roles, RolesGuard } from './auth';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Check dashboard service health' })
  health() {
    return { status: 'ok', service: 'dashboard' };
  }

  @Get('summary')
  getSummary(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getSummary(query.period);
  }

  @Get('test-trends')
  getTestTrends(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getTestTrends(query.period);
  }

  @Get('alerts')
  getAlerts() {
    return this.dashboardService.getAlerts();
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }

  @Get()
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getDashboard(query.period);
  }
}
