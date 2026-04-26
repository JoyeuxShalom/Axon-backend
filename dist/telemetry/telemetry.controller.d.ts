import { TelemetryService } from './telemetry.service';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    getHistory(patientId: string, limit?: string): Promise<any[]>;
    ingestDeviceData(data: IngestTelemetryDto): Promise<{
        success: boolean;
        risk_confidence: number;
        action: string;
    }>;
}
