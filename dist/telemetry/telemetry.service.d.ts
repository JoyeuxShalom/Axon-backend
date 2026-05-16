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
    getAlertsByPatient(patientId: string, filters: {
        status?: string;
        severity?: string;
        limit?: number;
    }): Promise<any[]>;
    getAlertDetail(alertId: string): Promise<{
        id: string;
        severity: string;
    }>;
    resolveAlert(alertId: string, resolvedNote?: string): Promise<{
        message: string;
    }>;
    getLatestTelemetry(patientId: string): Promise<FirebaseFirestore.DocumentData>;
}
