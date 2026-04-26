import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private defaultApp: admin.app.App;

  onModuleInit() {
    // Initialize Firebase Admin with your secret service account credentials
    // In production, load these from environment variables!
    const serviceAccount = require('../../firebase-service-account.json');

    this.defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://<YOUR-PROJECT-ID>.firebaseio.com" // Replace with yours
    });

    console.log('Firebase Admin SDK initialized successfully.');
  }

  getAuth() {
    return this.defaultApp.auth();
  }

  getFirestore() {
    return this.defaultApp.firestore();
  }

  getMessaging() {
    return this.defaultApp.messaging();
  }
}