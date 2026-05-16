import { EmergencyContactsService } from './emergency-contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class EmergencyContactsController {
    private readonly contactsService;
    constructor(contactsService: EmergencyContactsService);
    listContacts(req: any): Promise<any[]>;
    addContact(req: any, dto: CreateContactDto): Promise<{
        id: string;
        message: string;
    }>;
    updateContact(req: any, id: string, dto: UpdateContactDto): Promise<{
        message: string;
    }>;
    deleteContact(req: any, id: string): Promise<{
        message: string;
    }>;
    triggerSOS(req: any): Promise<{
        success: boolean;
        message: string;
        contactsNotified: any[];
    }>;
}
