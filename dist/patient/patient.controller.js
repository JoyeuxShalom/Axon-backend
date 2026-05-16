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
exports.PatientController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const patient_service_1 = require("./patient.service");
const create_patient_dto_1 = require("./dto/create-patient.dto");
const update_device_settings_dto_1 = require("./dto/update-device-settings.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PatientController = class PatientController {
    constructor(patientService) {
        this.patientService = patientService;
    }
    create(createPatientDto) {
        return this.patientService.createPatient(createPatientDto);
    }
    findOne(id) {
        return this.patientService.getPatientById(id);
    }
    findByWard(wardName) {
        return this.patientService.getPatientsByWard(wardName);
    }
    assignDevice(id, deviceId) {
        return this.patientService.assignDevice(id, deviceId);
    }
    getDeviceInfo(id) {
        return this.patientService.getDeviceInfo(id);
    }
    updateDeviceSettings(id, dto) {
        return this.patientService.updateDeviceSettings(id, dto);
    }
};
exports.PatientController = PatientController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new patient record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient registered successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_patient_dto_1.CreatePatientDto]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a patient by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the patient record.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('ward/:wardName'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all patients in a specific ward' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of patients in the ward.' }),
    __param(0, (0, common_1.Param)('wardName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "findByWard", null);
__decorate([
    (0, common_1.Patch)(':id/device'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign an IoT device to a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device assigned successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "assignDevice", null);
__decorate([
    (0, common_1.Get)(':id/device'),
    (0, swagger_1.ApiOperation)({ summary: 'Get device info and settings for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns device status, battery, and tracking settings.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "getDeviceInfo", null);
__decorate([
    (0, common_1.Patch)(':id/device/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update device tracking settings for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device settings updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_device_settings_dto_1.UpdateDeviceSettingsDto]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "updateDeviceSettings", null);
exports.PatientController = PatientController = __decorate([
    (0, swagger_1.ApiTags)('Patient Management'),
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [patient_service_1.PatientService])
], PatientController);
//# sourceMappingURL=patient.controller.js.map