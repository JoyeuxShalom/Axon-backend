import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSpecialistDto {
  @ApiPropertyOptional({ example: 'Dr. Sarah Jenkins' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Stroke Specialist' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({ example: 'neurologist', enum: ['neurologist', 'cardiologist'] })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '4.9' })
  @IsOptional()
  @IsString()
  rating?: string;

  @ApiPropertyOptional({ example: '120' })
  @IsOptional()
  @IsString()
  reviews?: string;

  @ApiPropertyOptional({ example: '12 yrs exp' })
  @IsOptional()
  @IsString()
  experience?: string;

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
