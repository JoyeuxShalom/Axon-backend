import { TelemetryService } from './telemetry.service';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';
import { ResolveAlertDto } from './dto/resolve-alert.dto';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    getHistory(patientId: string, limit?: string): Promise<any[]>;
    getLatest(patientId: string): Promise<FirebaseFirestore.DocumentData>;
    ingestDeviceData(data: IngestTelemetryDto): Promise<{
        success: boolean;
        risk_confidence: number;
        action: string;
    }>;
    getAlerts(patientId: string, status?: string, severity?: string, limit?: string): Promise<any[]>;
    getAlertDetail(alertId: string): Promise<{
        id: string;
        severity: string;
    }>;
    resolveAlert(alertId: string, dto: ResolveAlertDto): Promise<{
        message: string;
    }>;
}
