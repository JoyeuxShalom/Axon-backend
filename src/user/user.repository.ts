import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import type { Timestamp } from 'firebase-admin/firestore';
import { FirebaseService } from '../firebase/firebase.service';

export type UserProfileDoc = {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp | admin.firestore.FieldValue;
};

@Injectable()
export class UserRepository {
  private readonly collection = 'users';

  constructor(private readonly firebase: FirebaseService) {}

  async createUserProfile(input: {
    uid: string;
    email: string;
    displayName?: string;
  }): Promise<void> {
    const db = this.firebase.getFirestore();
    const doc: Omit<UserProfileDoc, 'createdAt'> & {
      createdAt: admin.firestore.FieldValue;
    } = {
      uid: input.uid,
      email: input.email,
      displayName: input.displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection(this.collection).doc(input.uid).set(doc);
  }

  async getProfileByUid(uid: string): Promise<UserProfileDoc | null> {
    const db = this.firebase.getFirestore();
    const snap = await db.collection(this.collection).doc(uid).get();
    if (!snap.exists) return null;
    return snap.data() as UserProfileDoc;
  }
}
