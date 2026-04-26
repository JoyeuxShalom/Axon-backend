import { MobileAuthService } from './mobile-auth.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';
export declare class MobileAuthController {
    private readonly mobileAuthService;
    constructor(mobileAuthService: MobileAuthService);
    register(dto: RegisterMobilePatientDto): Promise<{
        message: string;
        uid: string;
    }>;
}
