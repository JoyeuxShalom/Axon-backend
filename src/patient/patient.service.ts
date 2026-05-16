import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateDeviceSettingsDto } from './dto/update-device-settings.dto';

@Injectable()
export class PatientService {
  constructor(private firebase: FirebaseService) {}

  async createPatient(dto: CreatePatientDto) {
    try {
      const db = this.firebase.getFirestore();
      const newPatientRef = db.collection('Users').doc();
      
      await newPatientRef.set({
        ...dto,
        timestamp: new Date(),
      });

      return { id: newPatientRef.id, message: 'Patient registered successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to register patient');
    }
  }

  async getPatientById(id: string) {
    const db = this.firebase.getFirestore();
    const doc = await db.collection('Users').doc(id).get();
    
    if (!doc.exists) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return { id: doc.id, ...doc.data() };
  }

  async getPatientsByWard(ward: string) {
    const db = this.firebase.getFirestore();
    const snapshot = await db.collection('Users').where('ward', '==', ward).get();
    
    // FIX: Explicitly defined as an array of any type
    const patients: any[] = []; 
    snapshot.forEach(doc => patients.push({ id: doc.id, ...doc.data() }));
    return patients;
  }

  async assignDevice(patientId: string, deviceId: string) {
    try {
      const db = this.firebase.getFirestore();
      await db.collection('Users').doc(patientId).update({ deviceId });
      return { message: `Device ${deviceId} assigned to patient ${patientId}` };
    } catch (error) {
      throw new InternalServerErrorException('Failed to assign device');
    }
  }

  // ─── GET DEVICE INFO ───────────────────────────────────────
  async getDeviceInfo(patientId: string) {
    const db = this.firebase.getFirestore();
    const doc = await db.collection('Users').doc(patientId).get();

    if (!doc.exists) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
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

  // ─── UPDATE DEVICE SETTINGS ────────────────────────────────
  async updateDeviceSettings(patientId: string, dto: UpdateDeviceSettingsDto) {
    try {
      const db = this.firebase.getFirestore();
      const docRef = db.collection('Users').doc(patientId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException(`Patient with ID ${patientId} not found`);
      }

      // Build the nested settings update
      const settingsUpdate: Record<string, any> = {};
      if (dto.heartRateMonitor !== undefined) settingsUpdate['deviceSettings.heartRateMonitor'] = dto.heartRateMonitor;
      if (dto.spo2Tracking !== undefined) settingsUpdate['deviceSettings.spo2Tracking'] = dto.spo2Tracking;
      if (dto.sleepAnalysis !== undefined) settingsUpdate['deviceSettings.sleepAnalysis'] = dto.sleepAnalysis;
      settingsUpdate['deviceSettings.updatedAt'] = new Date();

      await docRef.update(settingsUpdate);

      return { message: 'Device settings updated successfully' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update device settings');
    }
  }
}