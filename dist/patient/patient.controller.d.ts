import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateDeviceSettingsDto } from './dto/update-device-settings.dto';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    create(createPatientDto: CreatePatientDto): Promise<{
        id: string;
        message: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
    }>;
    findByWard(wardName: string): Promise<any[]>;
    assignDevice(id: string, deviceId: string): Promise<{
        message: string;
    }>;
    getDeviceInfo(id: string): Promise<{
        deviceId: any;
        status: string;
        battery: any;
        lastSyncAt: any;
        settings: any;
    }>;
    updateDeviceSettings(id: string, dto: UpdateDeviceSettingsDto): Promise<{
        message: string;
    }>;
}
