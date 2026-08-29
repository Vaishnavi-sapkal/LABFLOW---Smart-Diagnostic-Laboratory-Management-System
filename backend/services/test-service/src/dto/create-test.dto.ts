import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TestParameterDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsString() @IsNotEmpty() unit!: string;
  @Type(() => Number) @IsNumber() referenceMin!: number;
  @Type(() => Number) @IsNumber() referenceMax!: number;
}

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  turnaroundHours!: number;

  @IsOptional()
  @IsBoolean()
  fastingRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  isPackage?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedTestIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestParameterDto)
  parameters?: TestParameterDto[];
}
