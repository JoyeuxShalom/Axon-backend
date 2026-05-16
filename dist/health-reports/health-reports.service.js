"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthReportsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let HealthReportsService = class HealthReportsService {
    constructor(firebase) {
        this.firebase = firebase;
    }
    async getSummary(patientId, period, date) {
        try {
            const db = this.firebase.getFirestore();
            const { startDate, endDate } = this.getDateRange(period, date);
            let query = db.collection('alerts')
                .where('patient_uid', '==', patientId)
                .where('timestamp', '>=', startDate)
                .where('timestamp', '<=', endDate);
            let snapshot;
            try {
                snapshot = await query.orderBy('timestamp', 'asc').get();
            }
            catch (error) {
                if (error.message?.includes('index')) {
                    console.warn('⚠️ Missing Index for Health Summary. Using memory-sort fallback.');
                    snapshot = await query.get();
                }
                else
                    throw error;
            }
            let readings = [];
            snapshot.forEach((doc) => readings.push(doc.data()));
            if (!snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
                readings.sort((a, b) => {
                    const tA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
                    const tB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
                    return tA - tB;
                });
            }
            if (readings.length === 0) {
                return {
                    period, date, startDate: startDate.toISOString(), endDate: endDate.toISOString(),
                    totalReadings: 0, heartRate: null, bloodPressure: null, spo2: null, riskSummary: null,
                };
            }
            const heartRates = readings.map(r => r.vitals_snapshot?.bpm).filter(v => v != null);
            const systolics = readings.map(r => r.vitals_snapshot?.systolic).filter(v => v != null);
            const diastolics = readings.map(r => r.vitals_snapshot?.diastolic).filter(v => v != null);
            const spo2s = readings.map(r => r.vitals_snapshot?.spo2).filter(v => v != null);
            const riskScores = readings.map(r => r.risk_confidence).filter(v => v != null);
            const criticalCount = readings.filter(r => r.status === 'UNRESOLVED').length;
            const stableCount = readings.filter(r => r.status === 'STABLE').length;
            const resolvedCount = readings.filter(r => r.status === 'RESOLVED').length;
            return {
                period, date, startDate: startDate.toISOString(), endDate: endDate.toISOString(),
                totalReadings: readings.length,
                heartRate: heartRates.length > 0 ? {
                    average: Math.round(this.avg(heartRates)),
                    peak: Math.max(...heartRates),
                    resting: Math.min(...heartRates),
                    readings: heartRates.length,
                } : null,
                bloodPressure: systolics.length > 0 ? {
                    averageSystolic: Math.round(this.avg(systolics)),
                    averageDiastolic: Math.round(this.avg(diastolics)),
                    peakSystolic: Math.max(...systolics),
                    peakDiastolic: Math.max(...diastolics),
                    stabilityScore: `${Math.round((stableCount / readings.length) * 100)}%`,
                    readings: systolics.length,
                } : null,
                spo2: spo2s.length > 0 ? {
                    average: parseFloat(this.avg(spo2s).toFixed(1)),
                    lowest: Math.min(...spo2s),
                    highest: Math.max(...spo2s),
                    readings: spo2s.length,
                } : null,
                riskSummary: {
                    averageRisk: parseFloat(this.avg(riskScores).toFixed(2)),
                    criticalAlerts: criticalCount,
                    stableReadings: stableCount,
                    resolvedAlerts: resolvedCount,
                },
            };
        }
        catch (error) {
            console.error('Error in getSummary:', error);
            throw error;
        }
    }
    async getTrend(patientId, period, date, metric) {
        try {
            const db = this.firebase.getFirestore();
            const { startDate, endDate } = this.getDateRange(period, date);
            let query = db.collection('alerts')
                .where('patient_uid', '==', patientId)
                .where('timestamp', '>=', startDate)
                .where('timestamp', '<=', endDate);
            let snapshot;
            try {
                snapshot = await query.orderBy('timestamp', 'asc').get();
            }
            catch (error) {
                if (error.message?.includes('index')) {
                    console.warn('⚠️ Missing Index for Health Trend. Using memory-sort fallback.');
                    snapshot = await query.get();
                }
                else
                    throw error;
            }
            let readings = [];
            snapshot.forEach((doc) => readings.push(doc.data()));
            if (!snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
                readings.sort((a, b) => {
                    const tA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
                    const tB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
                    return tA - tB;
                });
            }
            if (readings.length === 0) {
                return { period, date, metric, dataPoints: [], totalReadings: 0 };
            }
            const buckets = this.bucketReadings(readings, period, startDate, endDate);
            const dataPoints = buckets.map(bucket => {
                const point = {
                    label: bucket.label,
                    timestamp: bucket.start.toISOString(),
                    readingCount: bucket.readings.length,
                };
                if (metric === 'all' || metric === 'heartRate') {
                    const hrs = bucket.readings.map(r => r.vitals_snapshot?.bpm).filter(v => v != null);
                    point.heartRate = hrs.length > 0 ? {
                        avg: Math.round(this.avg(hrs)),
                        peak: Math.max(...hrs),
                        min: Math.min(...hrs),
                    } : null;
                }
                if (metric === 'all' || metric === 'bloodPressure') {
                    const sys = bucket.readings.map(r => r.vitals_snapshot?.systolic).filter(v => v != null);
                    const dia = bucket.readings.map(r => r.vitals_snapshot?.diastolic).filter(v => v != null);
                    point.bloodPressure = sys.length > 0 ? {
                        avgSystolic: Math.round(this.avg(sys)),
                        avgDiastolic: Math.round(this.avg(dia)),
                        peakSystolic: Math.max(...sys),
                        peakDiastolic: Math.max(...dia),
                    } : null;
                }
                if (metric === 'all' || metric === 'spo2') {
                    const spo2s = bucket.readings.map(r => r.vitals_snapshot?.spo2).filter(v => v != null);
                    point.spo2 = spo2s.length > 0 ? {
                        avg: parseFloat(this.avg(spo2s).toFixed(1)),
                        lowest: Math.min(...spo2s),
                        highest: Math.max(...spo2s),
                    } : null;
                }
                return point;
            });
            return {
                period, date, metric, startDate: startDate.toISOString(), endDate: endDate.toISOString(),
                totalReadings: readings.length, dataPoints,
            };
        }
        catch (error) {
            console.error('Error in getTrend:', error);
            throw error;
        }
    }
    async getComparison(patientId, period, date) {
        const current = await this.getSummary(patientId, period, date);
        const previousDate = this.getPreviousPeriodDate(period, date);
        const previous = await this.getSummary(patientId, period, previousDate);
        const changes = {};
        if (current.heartRate && previous.heartRate) {
            changes.heartRate = {
                avgChange: this.percentChange(previous.heartRate.average, current.heartRate.average),
                peakChange: this.percentChange(previous.heartRate.peak, current.heartRate.peak),
            };
        }
        if (current.bloodPressure && previous.bloodPressure) {
            changes.bloodPressure = {
                systolicChange: this.percentChange(previous.bloodPressure.averageSystolic, current.bloodPressure.averageSystolic),
                diastolicChange: this.percentChange(previous.bloodPressure.averageDiastolic, current.bloodPressure.averageDiastolic),
            };
        }
        if (current.spo2 && previous.spo2) {
            changes.spo2 = { avgChange: this.percentChange(previous.spo2.average, current.spo2.average) };
        }
        if (current.riskSummary && previous.riskSummary) {
            changes.risk = {
                avgRiskChange: this.percentChange(previous.riskSummary.averageRisk, current.riskSummary.averageRisk),
                criticalAlertsChange: (current.riskSummary.criticalAlerts - previous.riskSummary.criticalAlerts),
            };
        }
        return { period, currentDate: date, previousDate, current, previous, changes };
    }
    async getExportData(patientId, period, date, format) {
        try {
            const db = this.firebase.getFirestore();
            const { startDate, endDate } = this.getDateRange(period, date);
            let query = db.collection('alerts')
                .where('patient_uid', '==', patientId)
                .where('timestamp', '>=', startDate)
                .where('timestamp', '<=', endDate);
            let snapshot;
            try {
                snapshot = await query.orderBy('timestamp', 'asc').get();
            }
            catch (error) {
                if (error.message?.includes('index')) {
                    console.warn('⚠️ Missing Index for Data Export. Using memory-sort fallback.');
                    snapshot = await query.get();
                }
                else
                    throw error;
            }
            let readings = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                readings.push({
                    id: doc.id,
                    timestamp: data.timestamp,
                    bpm: data.vitals_snapshot?.bpm ?? null,
                    systolic: data.vitals_snapshot?.systolic ?? null,
                    diastolic: data.vitals_snapshot?.diastolic ?? null,
                    spo2: data.vitals_snapshot?.spo2 ?? null,
                    riskConfidence: data.risk_confidence ?? null,
                    status: data.status ?? null,
                    reason: data.analysis_reason ?? null,
                });
            });
            if (!snapshot.query.hasOwnProperty('_queryOptions') || snapshot.query._queryOptions?.explicitOrderBy === false) {
                readings.sort((a, b) => {
                    const tA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
                    const tB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
                    return tA - tB;
                });
            }
            if (format === 'csv') {
                const headers = 'Timestamp,BPM,Systolic,Diastolic,SpO2,Risk,Status,Reason';
                const rows = readings.map(r => `${r.timestamp},${r.bpm},${r.systolic},${r.diastolic},${r.spo2},${r.riskConfidence},${r.status},"${r.reason || ''}"`);
                return { format: 'csv', data: [headers, ...rows].join('\n'), totalRecords: readings.length };
            }
            return { format: 'json', period, startDate: startDate.toISOString(), endDate: endDate.toISOString(), totalRecords: readings.length, data: readings };
        }
        catch (error) {
            console.error('Error in getExportData:', error);
            throw error;
        }
    }
    getDateRange(period, dateStr) {
        const baseDate = new Date(dateStr);
        baseDate.setUTCHours(0, 0, 0, 0);
        let startDate;
        let endDate;
        switch (period) {
            case 'daily':
                startDate = new Date(baseDate);
                endDate = new Date(baseDate);
                endDate.setUTCHours(23, 59, 59, 999);
                break;
            case 'weekly':
                const dayOfWeek = baseDate.getUTCDay();
                const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                startDate = new Date(baseDate);
                startDate.setUTCDate(startDate.getUTCDate() + mondayOffset);
                endDate = new Date(startDate);
                endDate.setUTCDate(endDate.getUTCDate() + 6);
                endDate.setUTCHours(23, 59, 59, 999);
                break;
            case 'monthly':
                startDate = new Date(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), 1);
                endDate = new Date(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 0);
                endDate.setUTCHours(23, 59, 59, 999);
                break;
            default:
                startDate = new Date(baseDate);
                endDate = new Date(baseDate);
                endDate.setUTCHours(23, 59, 59, 999);
        }
        return { startDate, endDate };
    }
    avg(arr) {
        if (arr.length === 0)
            return 0;
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }
    bucketReadings(readings, period, startDate, endDate) {
        const buckets = [];
        switch (period) {
            case 'daily': {
                for (let h = 0; h < 24; h++) {
                    const bucketStart = new Date(startDate);
                    bucketStart.setUTCHours(h, 0, 0, 0);
                    const bucketEnd = new Date(startDate);
                    bucketEnd.setUTCHours(h, 59, 59, 999);
                    buckets.push({
                        label: `${h.toString().padStart(2, '0')}:00`,
                        start: bucketStart,
                        end: bucketEnd,
                        readings: [],
                    });
                }
                break;
            }
            case 'weekly': {
                const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                for (let d = 0; d < 7; d++) {
                    const bucketStart = new Date(startDate);
                    bucketStart.setUTCDate(bucketStart.getUTCDate() + d);
                    bucketStart.setUTCHours(0, 0, 0, 0);
                    const bucketEnd = new Date(bucketStart);
                    bucketEnd.setUTCHours(23, 59, 59, 999);
                    buckets.push({
                        label: dayNames[d],
                        start: bucketStart,
                        end: bucketEnd,
                        readings: [],
                    });
                }
                break;
            }
            case 'monthly': {
                let weekStart = new Date(startDate);
                let weekNum = 1;
                while (weekStart <= endDate) {
                    const weekEnd = new Date(weekStart);
                    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
                    if (weekEnd > endDate)
                        weekEnd.setTime(endDate.getTime());
                    buckets.push({
                        label: `Week ${weekNum}`,
                        start: new Date(weekStart),
                        end: new Date(weekEnd),
                        readings: [],
                    });
                    weekStart.setUTCDate(weekStart.getUTCDate() + 7);
                    weekNum++;
                }
                break;
            }
        }
        for (const reading of readings) {
            const ts = reading.timestamp?.toDate ? reading.timestamp.toDate() : new Date(reading.timestamp);
            for (const bucket of buckets) {
                if (ts >= bucket.start && ts <= bucket.end) {
                    bucket.readings.push(reading);
                    break;
                }
            }
        }
        return buckets;
    }
    getPreviousPeriodDate(period, dateStr) {
        const base = new Date(dateStr);
        switch (period) {
            case 'daily':
                base.setUTCDate(base.getUTCDate() - 1);
                break;
            case 'weekly':
                base.setUTCDate(base.getUTCDate() - 7);
                break;
            case 'monthly':
                base.setUTCMonth(base.getUTCMonth() - 1);
                break;
        }
        return base.toISOString().split('T')[0];
    }
    percentChange(oldVal, newVal) {
        if (oldVal === 0)
            return newVal === 0 ? '0.0%' : '+100.0%';
        const change = ((newVal - oldVal) / Math.abs(oldVal)) * 100;
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(1)}%`;
    }
};
exports.HealthReportsService = HealthReportsService;
exports.HealthReportsService = HealthReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], HealthReportsService);
//# sourceMappingURL=health-reports.service.js.map