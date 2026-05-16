import { HospitalTrackerService } from './hospital-tracker.service';
export declare class HospitalTrackerController {
    private readonly hospitalService;
    constructor(hospitalService: HospitalTrackerService);
    searchNearby(lat: string, lng: string, radius?: string, keyword?: string): Promise<any>;
    getDetails(placeId: string): Promise<any>;
}
