import { FirebaseService } from '../firebase/firebase.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { NotificationsService } from '../notifications/notifications.service';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';
export declare class TelemetryService {
    private firebase;
    private riskEngine;
    private notifications;
    constructor(firebase: FirebaseService, riskEngine: RiskEngineService, notifications: NotificationsService);
    getPatientHistory(patientId: string, limit?: number): Promise<any[]>;
    processDeviceData(payload: IngestTelemetryDto): Promise<{
        success: boolean;
        risk_confidence: number;
        action: string;
    }>;
}
