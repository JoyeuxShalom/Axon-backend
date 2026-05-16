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
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let PatientService = class PatientService {
    constructor(firebase) {
        this.firebase = firebase;
    }
    async createPatient(dto) {
        try {
            const db = this.firebase.getFirestore();
            const newPatientRef = db.collection('Users').doc();
            await newPatientRef.set({
                ...dto,
                timestamp: new Date(),
            });
            return { id: newPatientRef.id, message: 'Patient registered successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to register patient');
        }
    }
    async getPatientById(id) {
        const db = this.firebase.getFirestore();
        const doc = await db.collection('Users').doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Patient with ID ${id} not found`);
        }
        return { id: doc.id, ...doc.data() };
    }
    async getPatientsByWard(ward) {
        const db = this.firebase.getFirestore();
        const snapshot = await db.collection('Users').where('ward', '==', ward).get();
        const patients = [];
        snapshot.forEach(doc => patients.push({ id: doc.id, ...doc.data() }));
        return patients;
    }
    async assignDevice(patientId, deviceId) {
        try {
            const db = this.firebase.getFirestore();
            await db.collection('Users').doc(patientId).update({ deviceId });
            return { message: `Device ${deviceId} assigned to patient ${patientId}` };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to assign device');
        }
    }
    async getDeviceInfo(patientId) {
        const db = this.firebase.getFirestore();
        const doc = await db.collection('Users').doc(patientId).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Patient with ID ${patientId} not found`);
        }
        const data = doc.data() || {};
        return {
            deviceId: data.deviceId || null,
            status: data.deviceId ? 'connected' : 'not_paired',
            battery: data.deviceBattery || null,
            lastSyncAt: data.lastSyncAt || null,
            settings: data.deviceSettings || {
                heartRateMonitor: true,
                spo2Tracking: true,
                sleepAnalysis: false,
            },
        };
    }
    async updateDeviceSettings(patientId, dto) {
        try {
            const db = this.firebase.getFirestore();
            const docRef = db.collection('Users').doc(patientId);
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new common_1.NotFoundException(`Patient with ID ${patientId} not found`);
            }
            const settingsUpdate = {};
            if (dto.heartRateMonitor !== undefined)
                settingsUpdate['deviceSettings.heartRateMonitor'] = dto.heartRateMonitor;
            if (dto.spo2Tracking !== undefined)
                settingsUpdate['deviceSettings.spo2Tracking'] = dto.spo2Tracking;
            if (dto.sleepAnalysis !== undefined)
                settingsUpdate['deviceSettings.sleepAnalysis'] = dto.sleepAnalysis;
            settingsUpdate['deviceSettings.updatedAt'] = new Date();
            await docRef.update(settingsUpdate);
            return { message: 'Device settings updated successfully' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Failed to update device settings');
        }
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], PatientService);
//# sourceMappingURL=patient.service.js.map