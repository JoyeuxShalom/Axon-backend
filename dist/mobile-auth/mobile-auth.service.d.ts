import { FirebaseService } from '../firebase/firebase.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';
import { LoginMobileDto } from './dto/login-mobile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MailService } from '../mail/mail.service';
export declare class MobileAuthService {
    private firebase;
    private mailService;
    constructor(firebase: FirebaseService, mailService: MailService);
    registerPatient(dto: RegisterMobilePatientDto): Promise<{
        message: string;
        uid: string;
    }>;
    loginPatient(dto: LoginMobileDto): Promise<{
        message: string;
        uid: string;
        customToken: string;
        profile: {
            uid: string;
        } | null;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    getProfile(uid: string): Promise<{
        uid: string;
    }>;
    updateProfile(uid: string, dto: UpdateProfileDto): Promise<{
        message: string;
    }>;
}
