const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createTestUser() {
  const email = 'testuser@axon.com';
  const password = 'Password123!';
  
  try {
    // Delete if exists to avoid conflict
    try {
      const existingUser = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(existingUser.uid);
      console.log('Cleaned up existing test user.');
    } catch (e) {}

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: 'Test Axon User',
    });

    console.log('Successfully created new user:', userRecord.uid);
    console.log(`LOGIN EMAIL: ${email}`);
    console.log(`LOGIN PASSWORD: ${password}`);
    
    // Also create the Firestore profile so the app doesn't crash
    const db = admin.firestore();
    await db.collection('Users').doc(userRecord.uid).set({
      email: email,
      name: 'Test Axon User',
      role: 'patient',
      deviceId: 'test-device-id',
      createdAt: new Date(),
    });
    console.log('Firestore profile created.');

  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    process.exit();
  }
}

createTestUser();
