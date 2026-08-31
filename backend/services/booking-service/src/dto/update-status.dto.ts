import { IsIn } from 'class-validator';

export const BOOKING_STATUSES = ['pending', 'confirmed', 'sample-collected', 'completed', 'cancelled'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export class UpdateStatusDto {
  @IsIn(BOOKING_STATUSES)
  status!: BookingStatus;
}
