import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';

@Injectable()
export class NotificationsService {
  constructor(private firebase: FirebaseService) {}

  // ─── SAVE FCM TOKEN ────────────────────────────────────────
  async saveToken(uid: string, fcmToken: string) {
    try {
      const db = this.firebase.getFirestore();
      await db.collection('Users').doc(uid).set({ fcmToken }, { merge: true });
      return { message: 'Push notification token updated successfully' };
    } catch (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    }
  }

  // ─── SEND CRITICAL ALERT (internal, triggered by Risk Engine) ─
  async sendCriticalAlert(uid: string, patientName: string, riskLevel: number) {
    const db = this.firebase.getFirestore();
    const userDoc = await db.collection('Users').doc(uid).get();

    if (!userDoc.exists) return;

    const fcmToken = userDoc.data()?.fcmToken;

    // Always log the notification to the feed, regardless of FCM token
    await this.logNotification(uid, {
      title: 'CRITICAL STROKE ALERT 🚨',
      body: `${patientName} is showing a ${(riskLevel * 100).toFixed(1)}% stroke risk. Immediate action required.`,
      type: 'health',
      icon: 'monitor_heart_rounded',
      isCritical: true,
    });

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
    } catch (error) {
      console.error(`❌ Failed to send push notification:`, error);
    }
  }

  // ─── LOG NOTIFICATION (internal helper) ────────────────────
  private async logNotification(uid: string, data: {
    title: string;
    body: string;
    type: 'health' | 'system';
    icon?: string;
    isCritical?: boolean;
  }) {
    try {
      const db = this.firebase.getFirestore();
      await db.collection('notification_logs').add({
        uid,
        title: data.title,
        body: data.body,
        type: data.type,
        icon: data.icon || 'notifications',
        isCritical: data.isCritical || false,
        read: false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  // ─── GET NOTIFICATION FEED ─────────────────────────────────
  async getFeed(uid: string, type?: string, limit: number = 30) {
    try {
      const db = this.firebase.getFirestore();
      let query: any = db.collection('notification_logs')
        .where('uid', '==', uid);

      if (type && (type === 'health' || type === 'system')) {
        query = query.where('type', '==', type);
      }

      let snapshot;
      try {
        // Attempt sorted query first (requires index)
        snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();
      } catch (error) {
        if (error.message?.includes('index')) {
          console.warn('⚠️ Missing Firestore Index for sorted query. Falling back to in-memory sort.');
          console.warn('To fix this properly, create the index here:', error.message.split('https://')[1]?.split(' ')[0] ? 'https://' + error.message.split('https://')[1].split(' ')[0] : 'Check Firebase Console');
          
          // Fallback: fetch without orderBy, then sort in memory
          snapshot = await query.limit(limit * 2).get(); // Fetch more to increase chances of getting latest
        } else {
          throw error;
        }
      }

      let notifications: any[] = [];
      
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          title: data.title,
          message: data.body,
          type: data.type,
          icon: data.icon,
          isCritical: data.isCritical,
          isRead: data.read,
          timestamp: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
          createdAt: data.createdAt, // Keep for sorting
        });
      });

      // If we fell back, we need to sort manually
      if (notifications.length > 0 && !snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
        // Heuristic: check if snapshot was ordered. Firestore query objects are complex, 
        // simpler to just always sort if we suspect a fallback.
        notifications.sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
          return timeB - timeA;
        });
        notifications = notifications.slice(0, limit);
      }

      return notifications;
    } catch (error) {
      console.error('CRITICAL ERROR IN GET_FEED:', error);
      throw error;
    }
  }

  // ─── MARK SPECIFIC NOTIFICATIONS AS READ ───────────────────
  async markAsRead(uid: string, notificationIds: string[]) {
    try {
      const db = this.firebase.getFirestore();
      const batch = db.batch();

      for (const id of notificationIds) {
        const docRef = db.collection('notification_logs').doc(id);
        batch.update(docRef, { read: true, readAt: new Date() });
      }

      await batch.commit();
      return { message: `${notificationIds.length} notification(s) marked as read` };
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  // ─── MARK ALL AS READ ──────────────────────────────────────
  async markAllAsRead(uid: string) {
    try {
      const db = this.firebase.getFirestore();
      const snapshot = await db.collection('notification_logs')
        .where('uid', '==', uid)
        .where('read', '==', false)
        .get();

      if (snapshot.empty) {
        return { message: 'No unread notifications' };
      }

      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.update(doc.ref, { read: true, readAt: new Date() });
      });

      await batch.commit();
      return { message: `${snapshot.size} notification(s) marked as read` };
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  // ─── GET NOTIFICATION PREFERENCES ──────────────────────────
  async getPreferences(uid: string) {
    try {
      const db = this.firebase.getFirestore();
      const doc = await db.collection('notification_preferences').doc(uid).get();

      if (!doc.exists) {
        return {
          criticalAlerts: true,
          dailyReminders: true,
          biometricAlerts: false,
          weeklyReports: true,
        };
      }

      return doc.data();
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }

  // ─── UPDATE NOTIFICATION PREFERENCES ───────────────────────
  async updatePreferences(uid: string, dto: NotificationPreferencesDto) {
    try {
      const db = this.firebase.getFirestore();

      const updateData: Record<string, any> = {};
      if (dto.criticalAlerts !== undefined) updateData.criticalAlerts = dto.criticalAlerts;
      if (dto.dailyReminders !== undefined) updateData.dailyReminders = dto.dailyReminders;
      if (dto.biometricAlerts !== undefined) updateData.biometricAlerts = dto.biometricAlerts;
      if (dto.weeklyReports !== undefined) updateData.weeklyReports = dto.weeklyReports;
      updateData.updatedAt = new Date();

      await db.collection('notification_preferences').doc(uid).set(updateData, { merge: true });

      return { message: 'Notification preferences updated successfully' };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}