import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationPreferencesDto {
  @ApiPropertyOptional({ example: true, description: 'Receive critical vitals alerts' })
  @IsOptional()
  @IsBoolean()
  criticalAlerts?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Receive daily medication reminders' })
  @IsOptional()
  @IsBoolean()
  dailyReminders?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Receive biometric access alerts' })
  @IsOptional()
  @IsBoolean()
  biometricAlerts?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Receive weekly health report summaries' })
  @IsOptional()
  @IsBoolean()
  weeklyReports?: boolean;
}
