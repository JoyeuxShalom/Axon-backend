const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function testRegistration() {
  const email = 'test_reg_' + Date.now() + '@axon.com';
  const password = 'Password123!';
  const fullName = 'Test Registration';
  const deviceId = 'test-device';

  try {
    console.log(`Attempting to register: ${email}`);
    
    // 1. Create in Auth
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: fullName,
    });
    console.log('✅ Firebase Auth user created:', userRecord.uid);

    // 2. Create in Firestore
    const db = admin.firestore();
    await db.collection('Users').doc(userRecord.uid).set({
      email: email,
      name: fullName,
      deviceId: deviceId,
      role: 'patient',
      createdAt: new Date(),
    });
    console.log('✅ Firestore profile created.');

    // Cleanup
    await admin.auth().deleteUser(userRecord.uid);
    await db.collection('Users').doc(userRecord.uid).delete();
    console.log('🧹 Cleaned up test user.');

  } catch (error) {
    console.error('❌ Registration test failed:', error);
  } finally {
    process.exit();
  }
}

testRegistration();
