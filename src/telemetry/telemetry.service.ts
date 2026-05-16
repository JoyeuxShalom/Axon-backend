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
    try {
      const db = this.firebase.getFirestore();
      let query: any = db.collection('alerts')
        .where('patient_uid', '==', patientId);

      let snapshot;
      try {
        snapshot = await query.orderBy('timestamp', 'desc').limit(limit).get();
      } catch (error) {
        if (error.message?.includes('index')) {
          console.warn('⚠️ Missing Index for Patient History. Using memory-sort fallback.');
          snapshot = await query.limit(limit * 2).get();
        } else throw error;
      }

      let history: any[] = [];
      snapshot.forEach((doc: any) => history.push({ id: doc.id, ...doc.data() }));

      // Manual sort if fallback occurred
      if (!snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
        history.sort((a, b) => {
          const tA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
          const tB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
          return tB - tA;
        });
        history = history.slice(0, limit);
      }

      return history.reverse(); 
    } catch (error) {
      console.error('Error fetching patient history:', error);
      throw error;
    }
  }

  // --- HARDWARE GATEWAY ---
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
        steps: payload.steps,
        calories: payload.calories,
      }
    };

    await db.collection('alerts').add(alertData);

    // 4. Trigger push notification if critical
    if (analysis.is_critical) {
       const patientName = patientDoc.data().name || 'Patient';
       this.notifications.sendCriticalAlert(patientId, patientName, analysis.risk_confidence);
    }

    return { success: true, risk_confidence: analysis.risk_confidence, action: analysis.status };
  }

  // ─── ALERTS: GET BY PATIENT (with filters) ─────────────────
  async getAlertsByPatient(patientId: string, filters: { status?: string; severity?: string; limit?: number }) {
    try {
      const db = this.firebase.getFirestore();
      let query: any = db.collection('alerts')
        .where('patient_uid', '==', patientId);

      if (filters.status) {
        query = query.where('status', '==', filters.status.toUpperCase());
      }

      let snapshot;
      const limit = filters.limit || 50;
      try {
        snapshot = await query.orderBy('timestamp', 'desc').limit(limit).get();
      } catch (error) {
        if (error.message?.includes('index')) {
          console.warn('⚠️ Missing Index for Alerts Feed. Using memory-sort fallback.');
          snapshot = await query.limit(limit * 2).get();
        } else throw error;
      }

      let alerts: any[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        let severity = 'low';
        if (data.risk_confidence >= 0.7) severity = 'critical';
        else if (data.risk_confidence >= 0.4) severity = 'medium';

        alerts.push({ id: doc.id, severity, ...data });
      });

      // Manual sort if fallback occurred
      if (!snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
        alerts.sort((a, b) => {
          const tA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
          const tB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
          return tB - tA;
        });
        alerts = alerts.slice(0, limit);
      }

      if (filters.severity) {
        const sev = filters.severity.toLowerCase();
        return alerts.filter(a => a.severity === sev);
      }

      return alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  // ─── ALERTS: GET SINGLE DETAIL ─────────────────────────────
  async getAlertDetail(alertId: string) {
    const db = this.firebase.getFirestore();
    const doc = await db.collection('alerts').doc(alertId).get();

    if (!doc.exists) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    const data = doc.data() || {};
    let severity = 'low';
    if (data.risk_confidence >= 0.7) severity = 'critical';
    else if (data.risk_confidence >= 0.4) severity = 'medium';

    return { id: doc.id, severity, ...data };
  }

  // ─── ALERTS: RESOLVE ───────────────────────────────────────
  async resolveAlert(alertId: string, resolvedNote?: string) {
    const db = this.firebase.getFirestore();
    const docRef = db.collection('alerts').doc(alertId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    const updateData: any = {
      status: 'RESOLVED',
      resolvedAt: new Date(),
    };

    if (resolvedNote) {
      updateData.resolvedNote = resolvedNote;
    }

    await docRef.update(updateData);

    return { message: `Alert ${alertId} resolved successfully` };
  }

  async getLatestTelemetry(patientId: string) {
    const db = this.firebase.getFirestore();
    try {
      const snapshot = await db.collection('alerts')
        .where('patient_uid', '==', patientId)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return { 
          vitals_snapshot: { bpm: 0, spo2: 0, systolic: 0, diastolic: 0 },
          risk_confidence: 0,
          status: 'NO_DATA' 
        };
      }

      return snapshot.docs[0].data();
    } catch (error) {
      if (error.message?.includes('index')) {
        console.warn('⚠️ Missing Index for Latest Telemetry. Using memory-sort fallback.');
        const snapshot = await db.collection('alerts')
          .where('patient_uid', '==', patientId)
          .limit(10) // Get a few and sort
          .get();

        if (snapshot.empty) return { vitals_snapshot: { bpm: 0, spo2: 0, systolic: 0, diastolic: 0 }, status: 'NO_DATA' };

        const docs = snapshot.docs.map(d => d.data());
        docs.sort((a, b) => {
          const tA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
          const tB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
          return tB - tA;
        });
        return docs[0];
      }
      throw error;
    }
  }
}