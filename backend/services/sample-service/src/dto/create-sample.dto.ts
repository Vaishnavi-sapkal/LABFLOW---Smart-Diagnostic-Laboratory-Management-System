import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SAMPLE_PRIORITIES } from '../sample.schema';

export class CreateSampleDto {
  @IsString() @IsNotEmpty() bookingId!: string;
  @IsString() @IsNotEmpty() patientId!: string;
  @IsString() @IsNotEmpty() patientName!: string;
  @IsString() @IsNotEmpty() testDisplayName!: string;
  @IsString() @IsIn(SAMPLE_PRIORITIES) priority: (typeof SAMPLE_PRIORITIES)[number] = 'routine';
  @IsString() @IsNotEmpty() handledBy!: string;
}
