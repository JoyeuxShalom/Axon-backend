import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name of the emergency contact' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Spouse', description: 'Relationship to the patient' })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiProperty({ example: '+1 (555) 102-9384', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'high', description: 'Notification priority: high or normal', enum: ['high', 'normal'] })
  @IsOptional()
  @IsString()
  @IsIn(['high', 'normal'])
  priority?: string;
}
