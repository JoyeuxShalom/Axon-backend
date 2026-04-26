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
exports.MobileAuthService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let MobileAuthService = class MobileAuthService {
    constructor(firebase) {
        this.firebase = firebase;
    }
    async registerPatient(dto) {
        try {
            const auth = this.firebase.getAuth();
            const db = this.firebase.getFirestore();
            const userRecord = await auth.createUser({
                email: dto.email,
                password: dto.password,
                displayName: dto.fullName,
            });
            await db.collection('Users').doc(userRecord.uid).set({
                email: dto.email,
                name: dto.fullName,
                deviceId: dto.deviceId,
                role: 'patient',
                createdAt: new Date(),
            });
            return {
                message: 'Patient registered successfully',
                uid: userRecord.uid
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to register patient');
        }
    }
};
exports.MobileAuthService = MobileAuthService;
exports.MobileAuthService = MobileAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], MobileAuthService);
//# sourceMappingURL=mobile-auth.service.js.map