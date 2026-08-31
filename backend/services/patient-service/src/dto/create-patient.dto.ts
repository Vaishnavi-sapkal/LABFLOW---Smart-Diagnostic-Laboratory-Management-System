import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const GENDERS = ['male', 'female', 'other'] as const;
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export class CreatePatientDto {
  @IsString()
  @MaxLength(120)
  fullName!: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth!: Date;

  @IsEnum(GENDERS)
  gender!: (typeof GENDERS)[number];

  @IsOptional()
  @IsEnum(BLOOD_GROUPS)
  bloodGroup?: (typeof BLOOD_GROUPS)[number];

  @IsOptional()
  @IsString()
  @Matches(/^\d{12}$/, { message: 'aadhaarNumber must be exactly 12 digits' })
  aadhaarNumber?: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, { message: 'mobile must be a valid phone number' })
  mobile!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conditions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @IsOptional()
  @IsString()
  userId?: string;
}
