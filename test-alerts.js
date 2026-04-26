const mqtt = require('mqtt');

// Use WebSockets to bypass Wi-Fi firewalls
const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

client.on('connect', () => {
  console.log('📡 Fake ESP32 Connected. Sending alert...');

  const fakeAlert = {
    patient_uid: "patient_001",
    confidence: 0.96, 
    vitals: {
      bpm: 112,
      spo2: 87,
      systolic: 165
    }
  };

  // qos: 1 guarantees delivery to the broker
  client.publish('axon/patient_001/alerts', JSON.stringify(fakeAlert), { qos: 1 }, () => {
    console.log('🚀 Fake alert blasted to the cloud!');
    
    // Force the script to wait 1.5 seconds before shutting down 
    // so the network packet actually escapes your computer
    setTimeout(() => {
      process.exit(0); 
    }, 1500);
  });
});