import { SpecialistsService } from './specialists.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
export declare class SpecialistsController {
    private readonly specialistsService;
    constructor(specialistsService: SpecialistsService);
    listSpecialists(category?: string, search?: string): Promise<any[]>;
    getSpecialist(id: string): Promise<{
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
