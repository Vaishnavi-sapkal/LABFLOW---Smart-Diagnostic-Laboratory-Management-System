import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResultDto {
  @ApiProperty({ example: 'SMP-2408-001' })
  @IsString()
  @IsNotEmpty()
  sampleId!: string;

  @ApiProperty({ example: 'BKG-001' })
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @ApiProperty({ example: 'PAT-001' })
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({ example: 'TEST-CBC' })
  @IsString()
  @IsNotEmpty()
  testId!: string;

  @ApiPropertyOptional({ example: 'DOC-001' })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiPropertyOptional({ example: 'TECH-001' })
  @IsOptional()
  @IsString()
  enteredBy?: string;
}