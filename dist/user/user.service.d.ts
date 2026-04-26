import { FirebaseService } from '../firebase/firebase.service';
import { RegisterDoctorDto } from './dto/register.dto';
export declare class UserService {
    private firebase;
    constructor(firebase: FirebaseService);
    registerDoctor(dto: RegisterDoctorDto, uid: string): Promise<{
        message: string;
        uid: string;
    }>;
    getDoctorProfile(uid: string): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
