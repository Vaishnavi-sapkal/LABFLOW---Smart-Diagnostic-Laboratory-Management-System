import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVerificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  resultId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctorId!: string;
}
