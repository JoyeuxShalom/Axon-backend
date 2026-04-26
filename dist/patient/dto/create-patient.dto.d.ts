export declare class CreatePatientDto {
    name: string;
    dob: string;
    age: number;
    gender: string;
    nhi: string;
    ward: string;
    wardCode: string;
    risk: string;
    deviceId?: string;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
}
