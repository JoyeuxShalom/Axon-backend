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
        try {
            const db = this.firebase.getFirestore();
            await db.collection('Users').doc(uid).set({ fcmToken }, { merge: true });
            return { message: 'Push notification token updated successfully' };
        }
        catch (error) {
            console.error('Error saving FCM token:', error);
            throw error;
        }
    }
    async sendCriticalAlert(uid, patientName, riskLevel) {
        const db = this.firebase.getFirestore();
        const userDoc = await db.collection('Users').doc(uid).get();
        if (!userDoc.exists)
            return;
        const fcmToken = userDoc.data()?.fcmToken;
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
        }
        catch (error) {
            console.error(`❌ Failed to send push notification:`, error);
        }
    }
    async logNotification(uid, data) {
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
        }
        catch (error) {
            console.error('Error logging notification:', error);
        }
    }
    async getFeed(uid, type, limit = 30) {
        try {
            const db = this.firebase.getFirestore();
            let query = db.collection('notification_logs')
                .where('uid', '==', uid);
            if (type && (type === 'health' || type === 'system')) {
                query = query.where('type', '==', type);
            }
            let snapshot;
            try {
                snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();
            }
            catch (error) {
                if (error.message?.includes('index')) {
                    console.warn('⚠️ Missing Firestore Index for sorted query. Falling back to in-memory sort.');
                    console.warn('To fix this properly, create the index here:', error.message.split('https://')[1]?.split(' ')[0] ? 'https://' + error.message.split('https://')[1].split(' ')[0] : 'Check Firebase Console');
                    snapshot = await query.limit(limit * 2).get();
                }
                else {
                    throw error;
                }
            }
            let notifications = [];
            snapshot.forEach((doc) => {
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
                    createdAt: data.createdAt,
                });
            });
            if (notifications.length > 0 && !snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
                notifications.sort((a, b) => {
                    const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
                    const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
                    return timeB - timeA;
                });
                notifications = notifications.slice(0, limit);
            }
            return notifications;
        }
        catch (error) {
            console.error('CRITICAL ERROR IN GET_FEED:', error);
            throw error;
        }
    }
    async markAsRead(uid, notificationIds) {
        try {
            const db = this.firebase.getFirestore();
            const batch = db.batch();
            for (const id of notificationIds) {
                const docRef = db.collection('notification_logs').doc(id);
                batch.update(docRef, { read: true, readAt: new Date() });
            }
            await batch.commit();
            return { message: `${notificationIds.length} notification(s) marked as read` };
        }
        catch (error) {
            console.error('Error marking as read:', error);
            throw error;
        }
    }
    async markAllAsRead(uid) {
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
        }
        catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    }
    async getPreferences(uid) {
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
        }
        catch (error) {
            console.error('Error getting preferences:', error);
            throw error;
        }
    }
    async updatePreferences(uid, dto) {
        try {
            const db = this.firebase.getFirestore();
            const updateData = {};
            if (dto.criticalAlerts !== undefined)
                updateData.criticalAlerts = dto.criticalAlerts;
            if (dto.dailyReminders !== undefined)
                updateData.dailyReminders = dto.dailyReminders;
            if (dto.biometricAlerts !== undefined)
                updateData.biometricAlerts = dto.biometricAlerts;
            if (dto.weeklyReports !== undefined)
                updateData.weeklyReports = dto.weeklyReports;
            updateData.updatedAt = new Date();
            await db.collection('notification_preferences').doc(uid).set(updateData, { merge: true });
            return { message: 'Notification preferences updated successfully' };
        }
        catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map