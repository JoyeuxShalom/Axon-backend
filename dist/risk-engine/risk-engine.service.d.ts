export interface SensorData {
    patient_uid: string;
    spo2: number;
    bpm: number;
    systolic: number;
    diastolic: number;
    fall_detected: boolean;
}
export declare class RiskEngineService {
    evaluateStrokeRisk(data: SensorData): {
        risk_confidence: number;
        is_critical: boolean;
        status: string;
        reason: string;
    };
}
