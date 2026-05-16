const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(10);
    if (listUsersResult.users.length === 0) {
      console.log('NO_USERS_FOUND');
      return;
    }
    
    console.log('--- FIREBASE USERS ---');
    listUsersResult.users.forEach((userRecord) => {
      console.log(`Email: ${userRecord.email}, UID: ${userRecord.uid}`);
    });
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    process.exit();
  }
}

listUsers();
