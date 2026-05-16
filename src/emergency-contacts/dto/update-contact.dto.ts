import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Spouse', description: 'Relationship' })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional({ example: '+1 (555) 102-9384', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'high', description: 'Notification priority', enum: ['high', 'normal'] })
  @IsOptional()
  @IsString()
  @IsIn(['high', 'normal'])
  priority?: string;
}
