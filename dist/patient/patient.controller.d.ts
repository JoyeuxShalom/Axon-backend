import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
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
}
