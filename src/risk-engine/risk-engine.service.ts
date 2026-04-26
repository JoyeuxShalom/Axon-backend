import { Injectable } from '@nestjs/common';

export interface SensorData {
  patient_uid: string;
  spo2: number;
  bpm: number;
  systolic: number; // Estimated from Pulse Transit Time (PTT)
  diastolic: number;
  fall_detected: boolean; // From the MPU6050
}

@Injectable()
export class RiskEngineService {
  
  /**
   * Evaluates incoming telemetry against stroke markers.
   * Returns a risk score and the recommended alert status.
   */
  evaluateStrokeRisk(data: SensorData) {
    let riskScore = 0.1; // Baseline risk
    let isCritical = false;
    let alertReason = '';

    // 1. Blood Pressure Check (Hypertensive Crisis / Stroke Risk)
    if (data.systolic >= 180 || data.diastolic >= 110) {
      riskScore += 0.6;
      isCritical = true;
      alertReason = 'CRITICAL: Severe Hypertensive Spike detected. High stroke risk.';
    } else if (data.systolic >= 140) {
      riskScore += 0.3;
      alertReason = 'WARNING: Elevated Blood Pressure.';
    }

    // 2. Oxygen Saturation Check (Hypoxia)
    if (data.spo2 < 90) {
      riskScore += 0.4;
      isCritical = true;
      alertReason += ' CRITICAL: SpO2 dropped below 90%.';
    } else if (data.spo2 < 95) {
      riskScore += 0.2;
    }

    // 3. Heart Rate Check (Arrhythmia/AFib indicator)
    if (data.bpm > 130 || data.bpm < 50) {
      riskScore += 0.3;
      isCritical = true;
      alertReason += ' CRITICAL: Severe abnormal heart rate.';
    }

    // 4. MPU6050 Motion Check (Fall Detection / Tremors)
    if (data.fall_detected) {
      riskScore += 0.5;
      isCritical = true;
      alertReason += ' CRITICAL: Sudden fall or severe loss of motor control detected.';
    }

    // Cap the risk score at 0.99 (99%)
    riskScore = Math.min(0.99, riskScore);

    return {
      risk_confidence: parseFloat(riskScore.toFixed(2)),
      is_critical: isCritical,
      status: isCritical ? 'UNRESOLVED' : 'STABLE', // Only flag unresolved if it needs doctor attention
      reason: alertReason.trim() || 'Vitals normal.',
    };
  }
}