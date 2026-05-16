import { FirebaseService } from '../firebase/firebase.service';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';
export declare class NotificationsService {
    private firebase;
    constructor(firebase: FirebaseService);
    saveToken(uid: string, fcmToken: string): Promise<{
        message: string;
    }>;
    sendCriticalAlert(uid: string, patientName: string, riskLevel: number): Promise<void>;
    private logNotification;
    getFeed(uid: string, type?: string, limit?: number): Promise<any[]>;
    markAsRead(uid: string, notificationIds: string[]): Promise<{
        message: string;
    }>;
    markAllAsRead(uid: string): Promise<{
        message: string;
    }>;
    getPreferences(uid: string): Promise<FirebaseFirestore.DocumentData | undefined>;
    updatePreferences(uid: string, dto: NotificationPreferencesDto): Promise<{
        message: string;
    }>;
}
