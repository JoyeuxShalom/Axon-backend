import { FirebaseService } from '../firebase/firebase.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
export declare class SpecialistsService {
    private firebase;
    private readonly collection;
    constructor(firebase: FirebaseService);
    listSpecialists(category?: string, search?: string): Promise<any[]>;
    getSpecialistById(id: string): Promise<{
        id: string;
    }>;
    createSpecialist(dto: CreateSpecialistDto): Promise<{
        id: string;
        message: string;
    }>;
    updateSpecialist(id: string, dto: UpdateSpecialistDto): Promise<{
        id: string;
        message: string;
    }>;
    deleteSpecialist(id: string): Promise<{
        message: string;
    }>;
    seedDefaults(): Promise<{
        message: string;
    }>;
}
