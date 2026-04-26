import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterMobilePatientDto {
  @ApiProperty({ example: 'patient@axon.com', description: 'The patient email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'Minimum 6 characters' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full legal name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'AX-001', description: 'The hardware device ID assigned to them' })
  @IsString()
  deviceId: string;
}