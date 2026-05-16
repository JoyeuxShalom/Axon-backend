import { MobileAuthService } from './mobile-auth.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';
import { LoginMobileDto } from './dto/login-mobile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class MobileAuthController {
    private readonly mobileAuthService;
    constructor(mobileAuthService: MobileAuthService);
    register(dto: RegisterMobilePatientDto): Promise<{
        message: string;
        uid: string;
    }>;
    login(dto: LoginMobileDto): Promise<{
        message: string;
        uid: string;
        customToken: string;
        profile: {
            uid: string;
        } | null;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        uid: string;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        message: string;
    }>;
}
