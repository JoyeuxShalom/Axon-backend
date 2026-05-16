import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '+1-555-123-4567', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-05-15', description: 'Date of birth' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Male', description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 'O+', description: 'Blood type' })
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiPropertyOptional({ example: '725 5th Ave, New York, NY 10022', description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Allergic to penicillin', description: 'Emergency notes' })
  @IsOptional()
  @IsString()
  emergencyNote?: string;
}
