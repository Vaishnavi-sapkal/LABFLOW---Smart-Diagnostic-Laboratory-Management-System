import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking with test details and prices snapshotted from test service' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'List bookings, optionally filtered by patient, doctor, status, or date' })
  findAll(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.bookingService.findAll(patientId, doctorId, status, date);
  }

  @Get('availability')
  @ApiOperation({ summary: 'List booked and available time slots for a doctor on a date' })
  availability(@Query('doctorId') doctorId: string, @Query('date') date: string) {
    return this.bookingService.getAvailability(doctorId, date);
  }

  @Get('doctors/pending-counts')
  @ApiOperation({ summary: 'Get pending booking counts grouped by doctor' })
  pendingCounts() {
    return this.bookingService.getPendingCounts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition a booking to an allowed status' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.bookingService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking by ID' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Check booking service health' })
  health() {
    return { status: 'ok', service: 'booking' };
  }
}
