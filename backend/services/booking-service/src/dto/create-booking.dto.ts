import { ArrayMinSize, IsArray, IsDateString, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @MinLength(1)
  patientId!: string;

  @IsString()
  @MinLength(1)
  doctorId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @MinLength(1, { each: true })
  @IsMongoId({ each: true })
  testIds!: string[];

  @IsDateString()
  scheduledDate!: string;

  @IsString()
  @MinLength(1)
  scheduledSlot!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
