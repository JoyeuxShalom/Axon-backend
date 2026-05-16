import { ConfigService } from '@nestjs/config';
export declare class HospitalTrackerService {
    private configService;
    private readonly apiKey;
    private readonly placesBaseUrl;
    constructor(configService: ConfigService);
    searchNearby(lat: number, lng: number, radius?: number, keyword?: string): Promise<any>;
    getDetails(placeId: string): Promise<any>;
    private calculateDistance;
    private toRad;
    private estimateDriveTime;
    private buildDescription;
    private getFallbackHospitals;
    private getFallbackDetail;
}
