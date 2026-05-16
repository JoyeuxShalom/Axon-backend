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
exports.HospitalTrackerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hospital_tracker_service_1 = require("./hospital-tracker.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let HospitalTrackerController = class HospitalTrackerController {
    constructor(hospitalService) {
        this.hospitalService = hospitalService;
    }
    searchNearby(lat, lng, radius, keyword) {
        return this.hospitalService.searchNearby(parseFloat(lat), parseFloat(lng), radius ? parseInt(radius, 10) : undefined, keyword);
    }
    getDetails(placeId) {
        return this.hospitalService.getDetails(placeId);
    }
};
exports.HospitalTrackerController = HospitalTrackerController;
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for nearby hospitals/stroke centers using GPS coordinates' }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: true, type: Number, description: 'Latitude of the user' }),
    (0, swagger_1.ApiQuery)({ name: 'lng', required: true, type: Number, description: 'Longitude of the user' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number, description: 'Search radius in meters (default: 5000)' }),
    (0, swagger_1.ApiQuery)({ name: 'keyword', required: false, type: String, description: 'Search keyword (default: stroke center hospital neurology)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of nearby hospitals sorted by distance.' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], HospitalTrackerController.prototype, "searchNearby", null);
__decorate([
    (0, common_1.Get)(':placeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed info for a specific hospital (address, phone, hours, website)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns detailed hospital information.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hospital not found.' }),
    __param(0, (0, common_1.Param)('placeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalTrackerController.prototype, "getDetails", null);
exports.HospitalTrackerController = HospitalTrackerController = __decorate([
    (0, swagger_1.ApiTags)('Hospital Tracker'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.Controller)('mobile/hospitals'),
    __metadata("design:paramtypes", [hospital_tracker_service_1.HospitalTrackerService])
], HospitalTrackerController);
//# sourceMappingURL=hospital-tracker.controller.js.map