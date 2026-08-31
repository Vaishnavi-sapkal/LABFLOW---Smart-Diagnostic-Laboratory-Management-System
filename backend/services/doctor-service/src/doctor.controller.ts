import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorService } from './doctor.service';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a doctor profile' })
  create(@Body() createDoctorDto: CreateDoctorDto) { return this.doctorService.create(createDoctorDto); }

  @Get()
  @ApiOperation({ summary: 'List doctors, optionally filtered by active status or name' })
  findAll(@Query('isActive') isActive?: string, @Query('search') search?: string) {
    return this.doctorService.findAll(isActive, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor profile by ID' })
  findOne(@Param('id') id: string) { return this.doctorService.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor profile by ID' })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a doctor profile by deactivating it' })
  remove(@Param('id') id: string) { return this.doctorService.remove(id); }
}

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Check doctor service health' })
  health() { return { status: 'ok', service: 'doctor' }; }
}
