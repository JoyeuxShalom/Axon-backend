import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreatePatientDto } from './dto/create-patient.dto';

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
}