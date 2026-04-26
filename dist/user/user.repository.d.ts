import * as admin from 'firebase-admin';
import type { Timestamp } from 'firebase-admin/firestore';
import { FirebaseService } from '../firebase/firebase.service';
export type UserProfileDoc = {
    uid: string;
    email: string;
    displayName?: string;
    createdAt: Timestamp | admin.firestore.FieldValue;
};
export declare class UserRepository {
    private readonly firebase;
    private readonly collection;
    constructor(firebase: FirebaseService);
    createUserProfile(input: {
        uid: string;
        email: string;
        displayName?: string;
    }): Promise<void>;
    getProfileByUid(uid: string): Promise<UserProfileDoc | null>;
}
