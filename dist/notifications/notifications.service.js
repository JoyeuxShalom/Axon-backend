"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let NotificationsService = class NotificationsService {
    constructor(firebase) {
        this.firebase = firebase;
    }
    async saveToken(uid, fcmToken) {
        const db = this.firebase.getFirestore();
        await db.collection('Users').doc(uid).set({ fcmToken }, { merge: true });
        return { message: 'Push notification token updated successfully' };
    }
    async sendCriticalAlert(uid, patientName, riskLevel) {
        const db = this.firebase.getFirestore();
        const userDoc = await db.collection('Users').doc(uid).get();
        if (!userDoc.exists)
            return;
        const fcmToken = userDoc.data()?.fcmToken;
        if (!fcmToken) {
            console.log(`No FCM token found for ${patientName}. Skipping push notification.`);
            return;
        }
        const payload = {
            token: fcmToken,
            notification: {
                title: 'CRITICAL STROKE ALERT 🚨',
                body: `${patientName} is showing a ${(riskLevel * 100).toFixed(1)}% stroke risk. Immediate action required.`,
            },
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                patientId: uid,
                type: 'critical_alert'
            }
        };
        try {
            await this.firebase.getMessaging().send(payload);
            console.log(`✅ Push notification sent successfully to ${patientName}'s device.`);
        }
        catch (error) {
            console.error(`❌ Failed to send push notification:`, error);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map