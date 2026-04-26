// test-esp32.js
// This script simulates the ESP32 hardware sending data to your NestJS Backend

const simulateHardwarePulse = async () => {
    const telemetryData = {
      device_id: "AX-001", // IMPORTANT: Must match a patient's deviceId in your database!
      spo2: 35,            // CRITICAL: Low oxygen
      bpm: 115,            // CRITICAL: High heart rate
      systolic: 115,       // CRITICAL: Hypertensive crisis
      diastolic: 180,
      fall_detected: false
    };
  
    console.log("📡 ESP32 Simulator: Transmitting data to NestJS Backend...");
  
    try {
      const response = await fetch('http://localhost:3001/telemetry/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telemetryData)
      });
  
      const result = await response.json();
      console.log("✅ Backend Response Received:");
      console.log(result);
    } catch (error) {
      console.error("❌ Transmission Failed:", error.message);
    }
  };
  
  simulateHardwarePulse();