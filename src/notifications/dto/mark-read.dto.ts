import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkReadDto {
  @ApiProperty({ example: ['notif_abc123', 'notif_def456'], description: 'Array of notification IDs to mark as read' })
  @IsArray()
  @IsString({ each: true })
  notificationIds: string[];
}
