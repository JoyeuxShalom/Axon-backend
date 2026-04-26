import { FirebaseService } from '../firebase/firebase.service';
import { CreatePatientDto } from './dto/create-patient.dto';
export declare class PatientService {
    private firebase;
    constructor(firebase: FirebaseService);
    createPatient(dto: CreatePatientDto): Promise<{
        id: string;
        message: string;
    }>;
    getPatientById(id: string): Promise<{
        id: string;
    }>;
    getPatientsByWard(ward: string): Promise<any[]>;
    assignDevice(patientId: string, deviceId: string): Promise<{
        message: string;
    }>;
}
