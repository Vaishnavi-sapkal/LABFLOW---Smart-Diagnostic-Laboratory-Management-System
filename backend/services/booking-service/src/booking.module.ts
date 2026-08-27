import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { HealthController } from './health.controller';
import { Booking, BookingSchema } from './booking.schema';
import { BookingService } from './booking.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_booking'),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController, HealthController],
  providers: [BookingService],
})
export class BookingModule {}
