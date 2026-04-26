import { FirebaseService } from '../firebase/firebase.service';
export declare class NotificationsService {
    private firebase;
    constructor(firebase: FirebaseService);
    saveToken(uid: string, fcmToken: string): Promise<{
        message: string;
    }>;
    sendCriticalAlert(uid: string, patientName: string, riskLevel: number): Promise<void>;
}
