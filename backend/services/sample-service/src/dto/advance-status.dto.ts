import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdvanceStatusDto {
  @IsString()
  @IsNotEmpty()
  handledBy!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rejectionReason?: string;
}
