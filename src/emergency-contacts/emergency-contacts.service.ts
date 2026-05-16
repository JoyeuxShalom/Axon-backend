import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class EmergencyContactsService {
  private readonly collection = 'emergency_contacts';

  constructor(
    private firebase: FirebaseService,
    private notifications: NotificationsService
  ) {}

  // ─── LIST ALL CONTACTS ─────────────────────────────────────
  async listContacts(uid: string) {
    const db = this.firebase.getFirestore();
    const snapshot = await db.collection(this.collection)
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const contacts: any[] = [];
    snapshot.forEach(doc => contacts.push({ id: doc.id, ...doc.data() }));
    return contacts;
  }

  // ─── ADD CONTACT ───────────────────────────────────────────
  async addContact(uid: string, dto: CreateContactDto) {
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

  // ─── UPDATE CONTACT ────────────────────────────────────────
  async updateContact(uid: string, contactId: string, dto: UpdateContactDto) {
    const db = this.firebase.getFirestore();
    const docRef = db.collection(this.collection).doc(contactId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.uid !== uid) {
      throw new NotFoundException('Emergency contact not found');
    }

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.relationship !== undefined) updateData.relationship = dto.relationship;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    updateData.updatedAt = new Date();

    await docRef.update(updateData);

    return { message: 'Emergency contact updated successfully' };
  }

  // ─── DELETE CONTACT ────────────────────────────────────────
  async deleteContact(uid: string, contactId: string) {
    const db = this.firebase.getFirestore();
    const docRef = db.collection(this.collection).doc(contactId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.uid !== uid) {
      throw new NotFoundException('Emergency contact not found');
    }

    await docRef.delete();

    return { message: 'Emergency contact deleted successfully' };
  }

  // ─── TRIGGER SOS ───────────────────────────────────────────
  async triggerSOS(uid: string) {
    const db = this.firebase.getFirestore();
    
    // 1. Get Patient Name
    const patientDoc = await db.collection('Users').doc(uid).get();
    const patientName = patientDoc.data()?.name || 'A Patient';

    // 2. Fetch all contacts
    const contacts = await this.listContacts(uid);
    
    // 3. Trigger notification logic
    await this.notifications.sendCriticalAlert(uid, patientName, 1.0); // 1.0 = Manual SOS

    return { 
      success: true, 
      message: `SOS broadcasted to ${contacts.length} contacts`,
      contactsNotified: contacts.map(c => c.name)
    };
  }
}
