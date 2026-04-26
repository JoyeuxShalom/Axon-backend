import { OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
export declare class FirebaseService implements OnModuleInit {
    private defaultApp;
    onModuleInit(): void;
    getAuth(): import("firebase-admin/lib/auth/auth").Auth;
    getFirestore(): admin.firestore.Firestore;
    getMessaging(): import("firebase-admin/lib/messaging/messaging").Messaging;
}
