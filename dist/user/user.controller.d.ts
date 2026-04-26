import { UserService } from './user.service';
import { RegisterDoctorDto } from './dto/register.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(registerDto: RegisterDoctorDto, request: any): Promise<{
        message: string;
        uid: string;
    }>;
    getProfile(request: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
