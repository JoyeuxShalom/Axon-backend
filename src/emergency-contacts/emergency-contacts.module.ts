import { Module } from '@nestjs/common';
import { EmergencyContactsController } from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [EmergencyContactsController],
  providers: [EmergencyContactsService],
  exports: [EmergencyContactsService],
})
export class EmergencyContactsModule {}
