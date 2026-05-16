import { FirebaseService } from '../firebase/firebase.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class EmergencyContactsService {
    private firebase;
    private notifications;
    private readonly collection;
    constructor(firebase: FirebaseService, notifications: NotificationsService);
    listContacts(uid: string): Promise<any[]>;
    addContact(uid: string, dto: CreateContactDto): Promise<{
        id: string;
        message: string;
    }>;
    updateContact(uid: string, contactId: string, dto: UpdateContactDto): Promise<{
        message: string;
    }>;
    deleteContact(uid: string, contactId: string): Promise<{
        message: string;
    }>;
    triggerSOS(uid: string): Promise<{
        success: boolean;
        message: string;
        contactsNotified: any[];
    }>;
}
