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
exports.SpecialistsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const specialists_service_1 = require("./specialists.service");
const create_specialist_dto_1 = require("./dto/create-specialist.dto");
const update_specialist_dto_1 = require("./dto/update-specialist.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SpecialistsController = class SpecialistsController {
    constructor(specialistsService) {
        this.specialistsService = specialistsService;
    }
    listSpecialists(category, search) {
        return this.specialistsService.listSpecialists(category, search);
    }
    getSpecialist(id) {
        return this.specialistsService.getSpecialistById(id);
    }
    createSpecialist(dto) {
        return this.specialistsService.createSpecialist(dto);
    }
    updateSpecialist(id, dto) {
        return this.specialistsService.updateSpecialist(id, dto);
    }
    deleteSpecialist(id) {
        return this.specialistsService.deleteSpecialist(id);
    }
    seedDefaults() {
        return this.specialistsService.seedDefaults();
    }
};
exports.SpecialistsController = SpecialistsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all specialists with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: ['neurologist', 'cardiologist'], description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search by name or specialty' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of specialists.' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "listSpecialists", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single specialist by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the specialist details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Specialist not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "getSpecialist", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new specialist (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Specialist added successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_specialist_dto_1.CreateSpecialistDto]),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "createSpecialist", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a specialist (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Specialist not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_specialist_dto_1.UpdateSpecialistDto]),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "updateSpecialist", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specialist (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialist deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Specialist not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "deleteSpecialist", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({ summary: 'Seed the specialists collection with default data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Default data seeded.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "seedDefaults", null);
exports.SpecialistsController = SpecialistsController = __decorate([
    (0, swagger_1.ApiTags)('Specialists Directory'),
    (0, common_1.Controller)('specialists'),
    __metadata("design:paramtypes", [specialists_service_1.SpecialistsService])
], SpecialistsController);
//# sourceMappingURL=specialists.controller.js.map