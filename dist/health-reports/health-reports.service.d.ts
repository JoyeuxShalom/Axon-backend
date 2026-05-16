import { FirebaseService } from '../firebase/firebase.service';
export declare class HealthReportsService {
    private firebase;
    constructor(firebase: FirebaseService);
    getSummary(patientId: string, period: string, date: string): Promise<{
        period: string;
        date: string;
        startDate: string;
        endDate: string;
        totalReadings: number;
        heartRate: null;
        bloodPressure: null;
        spo2: null;
        riskSummary: null;
    } | {
        period: string;
        date: string;
        startDate: string;
        endDate: string;
        totalReadings: number;
        heartRate: {
            average: number;
            peak: number;
            resting: number;
            readings: number;
        } | null;
        bloodPressure: {
            averageSystolic: number;
            averageDiastolic: number;
            peakSystolic: number;
            peakDiastolic: number;
            stabilityScore: string;
            readings: number;
        } | null;
        spo2: {
            average: number;
            lowest: number;
            highest: number;
            readings: number;
        } | null;
        riskSummary: {
            averageRisk: number;
            criticalAlerts: number;
            stableReadings: number;
            resolvedAlerts: number;
        };
    }>;
    getTrend(patientId: string, period: string, date: string, metric: string): Promise<{
        period: string;
        date: string;
        metric: string;
        dataPoints: never[];
        totalReadings: number;
        startDate?: undefined;
        endDate?: undefined;
    } | {
        period: string;
        date: string;
        metric: string;
        startDate: string;
        endDate: string;
        totalReadings: number;
        dataPoints: any[];
    }>;
    getComparison(patientId: string, period: string, date: string): Promise<{
        period: string;
        currentDate: string;
        previousDate: string;
        current: {
            period: string;
            date: string;
            startDate: string;
            endDate: string;
            totalReadings: number;
            heartRate: null;
            bloodPressure: null;
            spo2: null;
            riskSummary: null;
        } | {
            period: string;
            date: string;
            startDate: string;
            endDate: string;
            totalReadings: number;
            heartRate: {
                average: number;
                peak: number;
                resting: number;
                readings: number;
            } | null;
            bloodPressure: {
                averageSystolic: number;
                averageDiastolic: number;
                peakSystolic: number;
                peakDiastolic: number;
                stabilityScore: string;
                readings: number;
            } | null;
            spo2: {
                average: number;
                lowest: number;
                highest: number;
                readings: number;
            } | null;
            riskSummary: {
                averageRisk: number;
                criticalAlerts: number;
                stableReadings: number;
                resolvedAlerts: number;
            };
        };
        previous: {
            period: string;
            date: string;
            startDate: string;
            endDate: string;
            totalReadings: number;
            heartRate: null;
            bloodPressure: null;
            spo2: null;
            riskSummary: null;
        } | {
            period: string;
            date: string;
            startDate: string;
            endDate: string;
            totalReadings: number;
            heartRate: {
                average: number;
                peak: number;
                resting: number;
                readings: number;
            } | null;
            bloodPressure: {
                averageSystolic: number;
                averageDiastolic: number;
                peakSystolic: number;
                peakDiastolic: number;
                stabilityScore: string;
                readings: number;
            } | null;
            spo2: {
                average: number;
                lowest: number;
                highest: number;
                readings: number;
            } | null;
            riskSummary: {
                averageRisk: number;
                criticalAlerts: number;
                stableReadings: number;
                resolvedAlerts: number;
            };
        };
        changes: any;
    }>;
    getExportData(patientId: string, period: string, date: string, format: string): Promise<{
        format: string;
        data: string;
        totalRecords: number;
        period?: undefined;
        startDate?: undefined;
        endDate?: undefined;
    } | {
        format: string;
        period: string;
        startDate: string;
        endDate: string;
        totalRecords: number;
        data: any[];
    }>;
    private getDateRange;
    private avg;
    private bucketReadings;
    private getPreviousPeriodDate;
    private percentChange;
}
