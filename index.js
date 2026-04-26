const mqtt = require('mqtt');
const admin = require('firebase-admin');

// 1. Initialize Firebase Admin
// Make sure your downloaded key is named exactly 'firebase-key.json' and is in the same folder
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
console.log('✅ Firebase Database Connected!');

// 2. Connect to the Public MQTT Broker (HiveMQ)
// This acts as our temporary cloud bridge until we build a custom one
const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

client.on('connect', () => {
  console.log('✅ Connected to HiveMQ Broker!');
  
  // We subscribe to a specific "Topic" that the ESP32 will broadcast to
  const topic = 'axon/patient_001/alerts';
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`🎧 Listening for stroke alerts on topic: ${topic}`);
    }
  });
});

// 3. Listen for incoming alerts from the ESP32
client.on('message', async (topic, message) => {
  try {
    // Convert the incoming message from a Buffer to a JSON object
    const alertData = JSON.parse(message.toString());
    
    console.log('\n🚨 NEW ALERT RECEIVED!');
    console.log(`Topic: ${topic}`);
    console.log(`Data:`, alertData);

    // Save the alert directly to your Firestore Database
    const docRef = await db.collection('alerts').add({
      patient_uid: alertData.patient_uid || 'patient_001',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      risk_confidence: alertData.confidence,
      vitals_snapshot: alertData.vitals,
      status: "UNRESOLVED"
    });

    console.log(`💾 Saved to Firebase successfully! Document ID: ${docRef.id}`);

  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
});