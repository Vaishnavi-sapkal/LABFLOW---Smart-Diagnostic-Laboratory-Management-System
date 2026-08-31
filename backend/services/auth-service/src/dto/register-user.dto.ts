import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Shruti' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'shrutitest2026@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'patient',
    enum: ['admin', 'doctor', 'receptionist', 'technician', 'patient'],
  })
  @IsIn(['admin', 'doctor', 'receptionist', 'technician', 'patient'])
  role!: string;
}
