import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ResolveAlertDto {
  @ApiPropertyOptional({ example: 'Patient was stabilized and medication adjusted.', description: 'Optional note about how the alert was resolved' })
  @IsOptional()
  @IsString()
  resolvedNote?: string;
}
