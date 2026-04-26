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
        const db = this.firebase.getFirestore();
        const snapshot = await db.collection('alerts')
            .where('patient_uid', '==', patientId)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        const history = [];
        snapshot.forEach(doc => history.push({ id: doc.id, ...doc.data() }));
        return history.reverse();
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
            }
        };
        await db.collection('alerts').add(alertData);
        if (analysis.is_critical) {
            const patientName = patientDoc.data().name || 'Patient';
            this.notifications.sendCriticalAlert(patientId, patientName, analysis.risk_confidence);
        }
        return { success: true, risk_confidence: analysis.risk_confidence, action: analysis.status };
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