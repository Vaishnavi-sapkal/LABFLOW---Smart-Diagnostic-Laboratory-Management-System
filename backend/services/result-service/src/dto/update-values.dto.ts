import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateValuesDto {
  @ApiProperty({
    example: [
      {
        parameterName: 'Hemoglobin',
        value: 13.5,
      },
    ],
  })
  @IsArray()
  values!: {
    parameterName: string;
    value: number;
  }[];
}