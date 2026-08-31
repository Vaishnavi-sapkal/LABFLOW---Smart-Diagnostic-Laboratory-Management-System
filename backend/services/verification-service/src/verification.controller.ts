import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateVerificationDto } from './dto/create-verification.dto';
import { ReviewDto } from './dto/review.dto';
import { VerificationService } from './verification.service';

@ApiTags('Verifications')
@Controller('verifications')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a pending verification from a submitted result' })
  @ApiBody({ type: CreateVerificationDto })
  create(@Body() dto: CreateVerificationDto) {
    return this.verificationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List verifications, optionally filtered by doctor or status' })
  findAll(@Query('doctorId') doctorId?: string, @Query('status') status?: string) {
    return this.verificationService.findAll({ doctorId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a verification by ID' })
  findOne(@Param('id') id: string) {
    return this.verificationService.findOne(id);
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Approve or reject a pending verification' })
  @ApiBody({ type: ReviewDto })
  review(@Param('id') id: string, @Body() dto: ReviewDto) {
    return this.verificationService.review(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a verification by ID' })
  remove(@Param('id') id: string) {
    return this.verificationService.remove(id);
  }
}

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Check verification service health' })
  health() {
    return { status: 'ok', service: 'verification' };
  }
}
