import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdateFcmTokenDto } from './dto/update-token.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Push Notifications')
@ApiBearerAuth() // Tells Swagger this requires the Firebase Token
@UseGuards(FirebaseAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('token')
  @ApiOperation({ summary: 'Save the mobile device FCM token for push alerts' })
  saveToken(@Req() req: any, @Body() dto: UpdateFcmTokenDto) {
    // req.user.uid comes automatically from the FirebaseAuthGuard validating their login!
    return this.notificationsService.saveToken(req.user.uid, dto.fcmToken);
  }
}