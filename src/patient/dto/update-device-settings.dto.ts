import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeviceSettingsDto {
  @ApiPropertyOptional({ example: true, description: 'Enable continuous heart rate monitoring' })
  @IsOptional()
  @IsBoolean()
  heartRateMonitor?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable hourly SpO2 tracking' })
  @IsOptional()
  @IsBoolean()
  spo2Tracking?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Enable high-precision sleep analysis' })
  @IsOptional()
  @IsBoolean()
  sleepAnalysis?: boolean;
}
