import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateValuesDto } from './dto/update-values.dto';

@ApiTags('Results')
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  // =========================
  // Health Check
  // =========================
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
  })
  @ApiResponse({
    status: 200,
    description: 'Result service is healthy',
  })
  health() {
    return {
      status: 'ok',
      service: 'result',
    };
  }

  // =========================
  // Create Result
  // =========================
  @Post()
  @ApiOperation({
    summary: 'Create a new result',
  })
  @ApiResponse({
    status: 201,
    description: 'Result created successfully',
  })
  create(@Body() dto: CreateResultDto) {
    return this.resultService.create(dto);
  }

  // =========================
  // Get All Results
  // =========================
  @Get()
  @ApiOperation({
    summary: 'Get all results',
  })
  @ApiQuery({
    name: 'sampleId',
    required: false,
    description: 'Filter by sample ID',
  })
  @ApiQuery({
    name: 'patientId',
    required: false,
    description: 'Filter by patient ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by result status',
  })
  findAll(
    @Query('sampleId') sampleId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
  ) {
    return this.resultService.findAll({
      sampleId,
      patientId,
      status,
    });
  }

  // =========================
  // Get Result By ID
  // =========================
  @Get(':id')
  @ApiOperation({
    summary: 'Get result by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Result retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Result not found',
  })
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(id);
  }

  // =========================
  // Update Result Values
  // =========================
  @Patch(':id/values')
  @ApiOperation({
    summary: 'Update result parameter values',
  })
  @ApiBody({
    type: UpdateValuesDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Result values updated successfully',
  })
  updateValues(
    @Param('id') id: string,
    @Body() dto: UpdateValuesDto,
  ) {
    return this.resultService.updateValues(id, dto.values);
  }

  // =========================
  // Update Technician Remarks
  // =========================
  @Patch(':id/remarks')
  @ApiOperation({
    summary: 'Update technician remarks',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        remarks: {
          type: 'string',
          example: 'Patient sample processed successfully.',
        },
      },
      required: ['remarks'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Remarks updated successfully',
  })
  updateRemarks(
    @Param('id') id: string,
    @Body('remarks') remarks: string,
  ) {
    return this.resultService.updateRemarks(id, remarks);
  }

  // =========================
  // Submit Result
  // =========================
  @Post(':id/submit')
  @ApiOperation({
    summary: 'Submit result for verification',
  })
  @ApiResponse({
    status: 200,
    description: 'Result submitted successfully',
  })
  submit(@Param('id') id: string) {
    return this.resultService.submit(id);
  }

  // =========================
  // Delete Result
  // =========================
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete result',
  })
  @ApiResponse({
    status: 200,
    description: 'Result deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.resultService.remove(id);
  }
}