import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpecialistDto {
  @ApiProperty({ example: 'Dr. Sarah Jenkins' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Stroke Specialist' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ example: 'neurologist', enum: ['neurologist', 'cardiologist'] })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '4.9' })
  @IsString()
  rating: string;

  @ApiProperty({ example: '120' })
  @IsString()
  reviews: string;

  @ApiProperty({ example: '12 yrs exp' })
  @IsString()
  experience: string;

  @ApiPropertyOptional({ example: 'Specializes in hypertension management and stroke prevention.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Mount Sinai Hospital' })
  @IsOptional()
  @IsString()
  hospital?: string;

  @ApiPropertyOptional({ example: '+1 (555) 019-8372' })
  @IsOptional()
  @IsString()
  phone?: string;
}
