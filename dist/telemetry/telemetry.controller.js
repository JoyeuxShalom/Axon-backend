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
exports.TelemetryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const telemetry_service_1 = require("./telemetry.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const ingest_telemetry_dto_1 = require("./dto/ingest-telemetry.dto");
const resolve_alert_dto_1 = require("./dto/resolve-alert.dto");
let TelemetryController = class TelemetryController {
    constructor(telemetryService) {
        this.telemetryService = telemetryService;
    }
    getHistory(patientId, limit) {
        const queryLimit = limit ? parseInt(limit, 10) : 20;
        return this.telemetryService.getPatientHistory(patientId, queryLimit);
    }
    getLatest(patientId) {
        return this.telemetryService.getLatestTelemetry(patientId);
    }
    async ingestDeviceData(data) {
        return this.telemetryService.processDeviceData(data);
    }
    getAlerts(patientId, status, severity, limit) {
        return this.telemetryService.getAlertsByPatient(patientId, {
            status,
            severity,
            limit: limit ? parseInt(limit, 10) : undefined,
        });
    }
    getAlertDetail(alertId) {
        return this.telemetryService.getAlertDetail(alertId);
    }
    resolveAlert(alertId, dto) {
        return this.telemetryService.resolveAlert(alertId, dto.resolvedNote);
    }
};
exports.TelemetryController = TelemetryController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('history/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get telemetry history for a patient (for charts)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of records to return' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TelemetryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('latest/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the absolute latest telemetry record for a patient' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TelemetryController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Post)('ingest'),
    (0, swagger_1.ApiOperation)({ summary: 'Ingest sensor data from ESP32 hardware device' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data processed and stored.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_telemetry_dto_1.IngestTelemetryDto]),
    __metadata("design:returntype", Promise)
], TelemetryController.prototype, "ingestDeviceData", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('alerts/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerts for a patient with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['UNRESOLVED', 'RESOLVED', 'STABLE'], description: 'Filter by alert status' }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, enum: ['low', 'medium', 'critical'], description: 'Filter by severity level' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Max number of alerts to return' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('severity')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], TelemetryController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('alerts/detail/:alertId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single alert with full details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the alert details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found.' }),
    __param(0, (0, common_1.Param)('alertId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TelemetryController.prototype, "getAlertDetail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('alerts/:alertId/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark an alert as resolved' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert resolved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found.' }),
    __param(0, (0, common_1.Param)('alertId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resolve_alert_dto_1.ResolveAlertDto]),
    __metadata("design:returntype", void 0)
], TelemetryController.prototype, "resolveAlert", null);
exports.TelemetryController = TelemetryController = __decorate([
    (0, swagger_1.ApiTags)('Telemetry & Alerts'),
    (0, common_1.Controller)('telemetry'),
    __metadata("design:paramtypes", [telemetry_service_1.TelemetryService])
], TelemetryController);
//# sourceMappingURL=telemetry.controller.js.map