import { NotificationsService } from './notifications.service';
import { UpdateFcmTokenDto } from './dto/update-token.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    saveToken(req: any, dto: UpdateFcmTokenDto): Promise<{
        message: string;
    }>;
}
