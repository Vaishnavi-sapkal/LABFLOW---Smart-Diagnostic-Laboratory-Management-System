import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SetStatusDto {
  @ApiProperty({
    enum: ['verified', 'rejected'],
  })
  @IsIn(['verified', 'rejected'])
  status!: 'verified' | 'rejected';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
