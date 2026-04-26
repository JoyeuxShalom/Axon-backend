import { FirebaseService } from '../firebase/firebase.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';
export declare class MobileAuthService {
    private firebase;
    constructor(firebase: FirebaseService);
    registerPatient(dto: RegisterMobilePatientDto): Promise<{
        message: string;
        uid: string;
    }>;
}
