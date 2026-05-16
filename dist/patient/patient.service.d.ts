import { FirebaseService } from '../firebase/firebase.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateDeviceSettingsDto } from './dto/update-device-settings.dto';
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
    getDeviceInfo(patientId: string): Promise<{
        deviceId: any;
        status: string;
        battery: any;
        lastSyncAt: any;
        settings: any;
    }>;
    updateDeviceSettings(patientId: string, dto: UpdateDeviceSettingsDto): Promise<{
        message: string;
    }>;
}
