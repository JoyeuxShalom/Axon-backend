import { Controller, Post, Get, Patch, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdateFcmTokenDto } from './dto/update-token.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Push Notifications')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ─── FCM TOKEN ─────────────────────────────────────────────

  @Post('token')
  @ApiOperation({ summary: 'Save the mobile device FCM token for push alerts' })
  @ApiResponse({ status: 201, description: 'Token saved successfully.' })
  saveToken(@Req() req: any, @Body() dto: UpdateFcmTokenDto) {
    return this.notificationsService.saveToken(req.user.uid, dto.fcmToken);
  }

  // ─── NOTIFICATION FEED ─────────────────────────────────────

  @Get('feed')
  @ApiOperation({ summary: 'Get notification feed for the authenticated user' })
  @ApiQuery({ name: 'type', required: false, enum: ['health', 'system'], description: 'Filter by notification type' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max number of notifications to return' })
  @ApiResponse({ status: 200, description: 'Returns list of notifications.' })
  getFeed(
    @Req() req: any,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getFeed(
      req.user.uid,
      type,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  // ─── MARK AS READ ──────────────────────────────────────────

  @Patch('read')
  @ApiOperation({ summary: 'Mark specific notifications as read' })
  @ApiResponse({ status: 200, description: 'Notifications marked as read.' })
  markAsRead(@Req() req: any, @Body() dto: MarkReadDto) {
    return this.notificationsService.markAsRead(req.user.uid, dto.notificationIds);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read.' })
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.uid);
  }

  // ─── NOTIFICATION PREFERENCES ──────────────────────────────

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preference toggles' })
  @ApiResponse({ status: 200, description: 'Returns notification preferences.' })
  getPreferences(@Req() req: any) {
    return this.notificationsService.getPreferences(req.user.uid);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preference toggles' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully.' })
  updatePreferences(@Req() req: any, @Body() dto: NotificationPreferencesDto) {
    return this.notificationsService.updatePreferences(req.user.uid, dto);
  }
}