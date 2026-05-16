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
exports.EmergencyContactsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const notifications_service_1 = require("../notifications/notifications.service");
let EmergencyContactsService = class EmergencyContactsService {
    constructor(firebase, notifications) {
        this.firebase = firebase;
        this.notifications = notifications;
        this.collection = 'emergency_contacts';
    }
    async listContacts(uid) {
        const db = this.firebase.getFirestore();
        const snapshot = await db.collection(this.collection)
            .where('uid', '==', uid)
            .orderBy('createdAt', 'desc')
            .get();
        const contacts = [];
        snapshot.forEach(doc => contacts.push({ id: doc.id, ...doc.data() }));
        return contacts;
    }
    async addContact(uid, dto) {
        const db = this.firebase.getFirestore();
        const docRef = await db.collection(this.collection).add({
            uid,
            name: dto.name,
            relationship: dto.relationship,
            phone: dto.phone,
            priority: dto.priority || 'normal',
            createdAt: new Date(),
        });
        return { id: docRef.id, message: 'Emergency contact added successfully' };
    }
    async updateContact(uid, contactId, dto) {
        const db = this.firebase.getFirestore();
        const docRef = db.collection(this.collection).doc(contactId);
        const doc = await docRef.get();
        if (!doc.exists || doc.data()?.uid !== uid) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.relationship !== undefined)
            updateData.relationship = dto.relationship;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.priority !== undefined)
            updateData.priority = dto.priority;
        updateData.updatedAt = new Date();
        await docRef.update(updateData);
        return { message: 'Emergency contact updated successfully' };
    }
    async deleteContact(uid, contactId) {
        const db = this.firebase.getFirestore();
        const docRef = db.collection(this.collection).doc(contactId);
        const doc = await docRef.get();
        if (!doc.exists || doc.data()?.uid !== uid) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        await docRef.delete();
        return { message: 'Emergency contact deleted successfully' };
    }
    async triggerSOS(uid) {
        const db = this.firebase.getFirestore();
        const patientDoc = await db.collection('Users').doc(uid).get();
        const patientName = patientDoc.data()?.name || 'A Patient';
        const contacts = await this.listContacts(uid);
        await this.notifications.sendCriticalAlert(uid, patientName, 1.0);
        return {
            success: true,
            message: `SOS broadcasted to ${contacts.length} contacts`,
            contactsNotified: contacts.map(c => c.name)
        };
    }
};
exports.EmergencyContactsService = EmergencyContactsService;
exports.EmergencyContactsService = EmergencyContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        notifications_service_1.NotificationsService])
], EmergencyContactsService);
//# sourceMappingURL=emergency-contacts.service.js.map