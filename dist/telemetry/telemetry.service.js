"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const risk_engine_service_1 = require("../risk-engine/risk-engine.service");
const notifications_service_1 = require("../notifications/notifications.service");
let TelemetryService = class TelemetryService {
    constructor(firebase, riskEngine, notifications) {
        this.firebase = firebase;
        this.riskEngine = riskEngine;
        this.notifications = notifications;
    }
    async getPatientHistory(patientId, limit = 20) {
        try {
            const db = this.firebase.getFirestore();
            let query = db.collection('alerts')
                .where('patient_uid', '==', patientId);
            let snapshot;
            try {
                snapshot = await query.orderBy('timestamp', 'desc').limit(limit).get();
            }
            catch (error) {
                if (error.message?.includes('index')) {
                    console.warn('⚠️ Missing Index for Patient History. Using memory-sort fallback.');
                    snapshot = await query.limit(limit * 2).get();
                }
                else
                    throw error;
            }
            let history = [];
            snapshot.forEach((doc) => history.push({ id: doc.id, ...doc.data() }));
            if (!snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
                history.sort((a, b) => {
                    const tA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
                    const tB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
                    return tB - tA;
                });
                history = history.slice(0, limit);
            }
            return history.reverse();
        }
        catch (error) {
            console.error('Error fetching patient history:', error);
            throw error;
        }
    }
    async processDeviceData(payload) {
        const db = this.firebase.getFirestore();
        const usersRef = db.collection('Users');
        const snapshot = await usersRef.where('deviceId', '==', payload.device_id).limit(1).get();
        if (snapshot.empty) {
            throw new common_1.NotFoundException(`Unregistered Device ID: ${payload.device_id}`);
        }
        const patientDoc = snapshot.docs[0];
        const patientId = patientDoc.id;
        const analysis = this.riskEngine.evaluateStrokeRisk({
            patient_uid: patientId,
            ...payload
        });
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
        if (analysis.is_critical) {
            const patientName = patientDoc.data().name || 'Patient';
            this.notifications.sendCriticalAlert(patientId, patientName, analysis.risk_confidence);
        }
        return { success: true, risk_confidence: analysis.risk_confidence, action: analysis.status };
    }
    async getAlertsByPatient(patientId, filters) {
        try {
            const db = this.firebase.getFirestore();
            let query = db.collection('alerts')
                .where('patient_uid', '==', patientId);
            if (filters.status) {
                query = query.where('status', '==', filters.status.toUpperCase());
            }
            let snapshot;
            const limit = filters.limit || 50;
            try {
                snapshot = await query.orderBy('timestamp', 'desc').limit(limit).get();
            }
            catch (error) {
                if (error.message?.includes('index')) {
                    console.warn('⚠️ Missing Index for Alerts Feed. Using memory-sort fallback.');
                    snapshot = await query.limit(limit * 2).get();
                }
                else
                    throw error;
            }
            let alerts = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                let severity = 'low';
                if (data.risk_confidence >= 0.7)
                    severity = 'critical';
                else if (data.risk_confidence >= 0.4)
                    severity = 'medium';
                alerts.push({ id: doc.id, severity, ...data });
            });
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
        }
        catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    }
    async getAlertDetail(alertId) {
        const db = this.firebase.getFirestore();
        const doc = await db.collection('alerts').doc(alertId).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Alert with ID ${alertId} not found`);
        }
        const data = doc.data() || {};
        let severity = 'low';
        if (data.risk_confidence >= 0.7)
            severity = 'critical';
        else if (data.risk_confidence >= 0.4)
            severity = 'medium';
        return { id: doc.id, severity, ...data };
    }
    async resolveAlert(alertId, resolvedNote) {
        const db = this.firebase.getFirestore();
        const docRef = db.collection('alerts').doc(alertId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Alert with ID ${alertId} not found`);
        }
        const updateData = {
            status: 'RESOLVED',
            resolvedAt: new Date(),
        };
        if (resolvedNote) {
            updateData.resolvedNote = resolvedNote;
        }
        await docRef.update(updateData);
        return { message: `Alert ${alertId} resolved successfully` };
    }
    async getLatestTelemetry(patientId) {
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
        }
        catch (error) {
            if (error.message?.includes('index')) {
                console.warn('⚠️ Missing Index for Latest Telemetry. Using memory-sort fallback.');
                const snapshot = await db.collection('alerts')
                    .where('patient_uid', '==', patientId)
                    .limit(10)
                    .get();
                if (snapshot.empty)
                    return { vitals_snapshot: { bpm: 0, spo2: 0, systolic: 0, diastolic: 0 }, status: 'NO_DATA' };
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
};
exports.TelemetryService = TelemetryService;
exports.TelemetryService = TelemetryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        risk_engine_service_1.RiskEngineService,
        notifications_service_1.NotificationsService])
], TelemetryService);
//# sourceMappingURL=telemetry.service.js.map