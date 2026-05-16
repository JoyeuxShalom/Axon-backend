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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_reports_service_1 = require("./health-reports.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let HealthReportsController = class HealthReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getSummary(patientId, period, date) {
        return this.reportsService.getSummary(patientId, period, date);
    }
    getExportData(patientId, format, period, date) {
        return this.reportsService.getExportData(patientId, period || 'daily', date || new Date().toISOString().split('T')[0], format || 'json');
    }
    getTrend(patientId, period, date, metric) {
        return this.reportsService.getTrend(patientId, period, date, metric || 'all');
    }
    getComparison(patientId, period, date) {
        return this.reportsService.getComparison(patientId, period, date);
    }
};
exports.HealthReportsController = HealthReportsController;
__decorate([
    (0, common_1.Get)(':patientId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregated health report summary for a patient' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns aggregated vitals summary (avg, peak, min for HR, BP, SpO2).' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], HealthReportsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':patientId/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export health report data for client-side PDF/CSV rendering' }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: false, enum: ['json', 'csv'], description: 'Export format (default: json)' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns formatted data for export.' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('period')),
    __param(3, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], HealthReportsController.prototype, "getExportData", null);
__decorate([
    (0, common_1.Get)(':patientId/trend'),
    (0, swagger_1.ApiOperation)({ summary: 'Get time-series trend data for charting (daily=hourly, weekly=daily, monthly=weekly buckets)' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'metric', required: false, enum: ['heartRate', 'bloodPressure', 'spo2', 'all'], description: 'Metric to return (default: all)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns time-bucketed data points for chart rendering.' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('metric')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], HealthReportsController.prototype, "getTrend", null);
__decorate([
    (0, common_1.Get)(':patientId/compare'),
    (0, swagger_1.ApiOperation)({ summary: 'Compare current period stats vs previous period (e.g., this week vs last week)' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns current summary, previous summary, and percentage changes.' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], HealthReportsController.prototype, "getComparison", null);
exports.HealthReportsController = HealthReportsController = __decorate([
    (0, swagger_1.ApiTags)('Health Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.Controller)('mobile/health-reports'),
    __metadata("design:paramtypes", [health_reports_service_1.HealthReportsService])
], HealthReportsController);
//# sourceMappingURL=health-reports.controller.js.map