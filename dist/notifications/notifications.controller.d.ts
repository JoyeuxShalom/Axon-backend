import { NotificationsService } from './notifications.service';
import { UpdateFcmTokenDto } from './dto/update-token.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    saveToken(req: any, dto: UpdateFcmTokenDto): Promise<{
        message: string;
    }>;
    getFeed(req: any, type?: string, limit?: string): Promise<any[]>;
    markAsRead(req: any, dto: MarkReadDto): Promise<{
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    getPreferences(req: any): Promise<FirebaseFirestore.DocumentData | undefined>;
    updatePreferences(req: any, dto: NotificationPreferencesDto): Promise<{
        message: string;
    }>;
}
