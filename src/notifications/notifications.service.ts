import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class NotificationsService {
  constructor(private firebase: FirebaseService) {}

  // 1. API used by Mobile App to save their device token
  async saveToken(uid: string, fcmToken: string) {
    const db = this.firebase.getFirestore();
    // Merge true ensures we don't overwrite their whole profile, just update the token
    await db.collection('Users').doc(uid).set({ fcmToken }, { merge: true });
    return { message: 'Push notification token updated successfully' };
  }

  // 2. Internal function triggered by our Risk Engine
  async sendCriticalAlert(uid: string, patientName: string, riskLevel: number) {
    const db = this.firebase.getFirestore();
    const userDoc = await db.collection('Users').doc(uid).get();

    if (!userDoc.exists) return;

    const fcmToken = userDoc.data()?.fcmToken;
    if (!fcmToken) {
      console.log(`No FCM token found for ${patientName}. Skipping push notification.`);
      return; 
    }

    // The Payload that appears on the phone screen
    const payload = {
      token: fcmToken,
      notification: {
        title: 'CRITICAL STROKE ALERT 🚨',
        body: `${patientName} is showing a ${(riskLevel * 100).toFixed(1)}% stroke risk. Immediate action required.`,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK', // Helps the mobile app route the click
        patientId: uid,
        type: 'critical_alert'
      }
    };

    try {
      await this.firebase.getMessaging().send(payload);
      console.log(`✅ Push notification sent successfully to ${patientName}'s device.`);
    } catch (error) {
      console.error(`❌ Failed to send push notification:`, error);
    }
  }
}