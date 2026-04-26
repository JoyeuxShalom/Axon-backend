import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { NotificationsService } from '../notifications/notifications.service';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';

@Injectable()
export class TelemetryService {
  constructor(
    private firebase: FirebaseService,
    private riskEngine: RiskEngineService, // Inject the Brain!
    private notifications: NotificationsService // Inject the Notifications Sender!
  ) {}

  async getPatientHistory(patientId: string, limit: number = 20) {
    const db = this.firebase.getFirestore();
    const snapshot = await db.collection('alerts')
      .where('patient_uid', '==', patientId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const history: any[] = [];
    snapshot.forEach(doc => history.push({ id: doc.id, ...doc.data() }));
    return history.reverse(); 
  }

  // --- NEW: THE HARDWARE GATEWAY ---
  async processDeviceData(payload: IngestTelemetryDto) {
    const db = this.firebase.getFirestore();

    // 1. Look up which patient owns this ESP32 device
    const usersRef = db.collection('Users');
    const snapshot = await usersRef.where('deviceId', '==', payload.device_id).limit(1).get();

    if (snapshot.empty) {
      throw new NotFoundException(`Unregistered Device ID: ${payload.device_id}`);
    }

    const patientDoc = snapshot.docs[0];
    const patientId = patientDoc.id;

    // 2. Ask the Risk Engine to analyze the data
    const analysis = this.riskEngine.evaluateStrokeRisk({
      patient_uid: patientId,
      ...payload
    });

    // 3. Save the payload to Firestore
    const alertData = {
      patient_uid: patientId,
      device_id: payload.device_id,
      timestamp: new Date(),
      risk_confidence: analysis.risk_confidence,
      status: analysis.status,
      analysis_reason: analysis.reason,
      vitals_snapshot: {
        bpm: payload.bpm,
        spo2: payload.spo2,
        systolic: payload.systolic,
        diastolic: payload.diastolic,
      }
    };

    // If it's critical, save it as an Alert. If stable, maybe save to a 'history' log to save DB costs.
    // For MVP, we will save everything to 'alerts' so the charts move.
    await db.collection('alerts').add(alertData);

    // --- NEW: TRIGGER PUSH NOTIFICATION IF CRITICAL ---
    if (analysis.is_critical) {
       const patientName = patientDoc.data().name || 'Patient';
       // Fire and forget (no need to await, let it run in the background)
       this.notifications.sendCriticalAlert(patientId, patientName, analysis.risk_confidence);
    }

    return { success: true, risk_confidence: analysis.risk_confidence, action: analysis.status };
  }
}