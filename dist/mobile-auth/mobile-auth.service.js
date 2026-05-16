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
const mail_service_1 = require("../mail/mail.service");
let MobileAuthService = class MobileAuthService {
    constructor(firebase, mailService) {
        this.firebase = firebase;
        this.mailService = mailService;
    }
    async registerPatient(dto) {
        const auth = this.firebase.getAuth();
        const db = this.firebase.getFirestore();
        try {
            try {
                await auth.getUserByEmail(dto.email);
                throw new common_1.BadRequestException('This email is already registered. Please sign in instead.');
            }
            catch (e) {
                if (e.status === 400)
                    throw e;
            }
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
            try {
                await this.mailService.sendMail(dto.email, 'Welcome to Axon Medical!', 'welcome', { name: dto.fullName, email: dto.email });
            }
            catch (mailError) {
                console.error('Failed to send welcome email:', mailError);
            }
            return {
                message: 'Patient registered successfully',
                uid: userRecord.uid
            };
        }
        catch (error) {
            if (error.code === 'auth/email-already-exists') {
                throw new common_1.BadRequestException('This email is already registered. Please sign in instead.');
            }
            throw new common_1.BadRequestException(error.message || 'Failed to register patient');
        }
    }
    async loginPatient(dto) {
        try {
            const auth = this.firebase.getAuth();
            const db = this.firebase.getFirestore();
            const userRecord = await auth.getUserByEmail(dto.email);
            const customToken = await auth.createCustomToken(userRecord.uid);
            const profileDoc = await db.collection('Users').doc(userRecord.uid).get();
            const profile = profileDoc.exists ? profileDoc.data() : null;
            return {
                message: 'Login successful',
                uid: userRecord.uid,
                customToken,
                profile: profile ? { ...profile, uid: userRecord.uid } : null,
            };
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                throw new common_1.UnauthorizedException('No account found with this email address');
            }
            throw new common_1.UnauthorizedException(error.message || 'Login failed');
        }
    }
    async forgotPassword(email) {
        try {
            const auth = this.firebase.getAuth();
            await auth.getUserByEmail(email);
            const resetLink = await auth.generatePasswordResetLink(email);
            await this.mailService.sendMail(email, 'Reset Your Axon Password', 'password-reset', { resetLink });
            console.log(`Password reset email sent to ${email}`);
            return {
                message: 'Password reset email sent successfully. Please check your inbox.',
            };
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                return { message: 'If this email is registered, a reset link has been sent.' };
            }
            throw new common_1.BadRequestException(error.message || 'Failed to send password reset email');
        }
    }
    async getProfile(uid) {
        const db = this.firebase.getFirestore();
        const doc = await db.collection('Users').doc(uid).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        return { uid: doc.id, ...doc.data() };
    }
    async updateProfile(uid, dto) {
        try {
            const db = this.firebase.getFirestore();
            const auth = this.firebase.getAuth();
            const updateData = {};
            if (dto.fullName !== undefined)
                updateData.name = dto.fullName;
            if (dto.phone !== undefined)
                updateData.phone = dto.phone;
            if (dto.dateOfBirth !== undefined)
                updateData.dateOfBirth = dto.dateOfBirth;
            if (dto.gender !== undefined)
                updateData.gender = dto.gender;
            if (dto.bloodType !== undefined)
                updateData.bloodType = dto.bloodType;
            if (dto.address !== undefined)
                updateData.address = dto.address;
            if (dto.emergencyNote !== undefined)
                updateData.emergencyNote = dto.emergencyNote;
            updateData.updatedAt = new Date();
            await db.collection('Users').doc(uid).set(updateData, { merge: true });
            if (dto.fullName) {
                await auth.updateUser(uid, { displayName: dto.fullName });
            }
            return { message: 'Profile updated successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to update profile');
        }
    }
};
exports.MobileAuthService = MobileAuthService;
exports.MobileAuthService = MobileAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        mail_service_1.MailService])
], MobileAuthService);
//# sourceMappingURL=mobile-auth.service.js.map