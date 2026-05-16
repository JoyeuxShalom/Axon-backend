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
exports.MobileAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mobile_auth_service_1 = require("./mobile-auth.service");
const register_mobile_dto_1 = require("./dto/register-mobile.dto");
const login_mobile_dto_1 = require("./dto/login-mobile.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MobileAuthController = class MobileAuthController {
    constructor(mobileAuthService) {
        this.mobileAuthService = mobileAuthService;
    }
    register(dto) {
        console.log('--- MOBILE REGISTRATION ATTEMPT ---');
        console.log('Email:', dto.email);
        return this.mobileAuthService.registerPatient(dto);
    }
    login(dto) {
        console.log('--- MOBILE LOGIN ATTEMPT ---');
        console.log('Email:', dto.email);
        return this.mobileAuthService.loginPatient(dto);
    }
    forgotPassword(dto) {
        return this.mobileAuthService.forgotPassword(dto.email);
    }
    getProfile(req) {
        return this.mobileAuthService.getProfile(req.user.uid);
    }
    updateProfile(req, dto) {
        return this.mobileAuthService.updateProfile(req.user.uid, dto);
    }
};
exports.MobileAuthController = MobileAuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new patient from the mobile app' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient registered successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request (e.g., email already exists).' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_mobile_dto_1.RegisterMobilePatientDto]),
    __metadata("design:returntype", void 0)
], MobileAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Login a patient and receive a custom token + profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful. Returns customToken and profile.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_mobile_dto_1.LoginMobileDto]),
    __metadata("design:returntype", void 0)
], MobileAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a password reset email to the patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reset email sent (if account exists).' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], MobileAuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the authenticated patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the patient profile from Firestore.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileAuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update the authenticated patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], MobileAuthController.prototype, "updateProfile", null);
exports.MobileAuthController = MobileAuthController = __decorate([
    (0, swagger_1.ApiTags)('Mobile App Authentication'),
    (0, common_1.Controller)('mobile/auth'),
    __metadata("design:paramtypes", [mobile_auth_service_1.MobileAuthService])
], MobileAuthController);
//# sourceMappingURL=mobile-auth.controller.js.map