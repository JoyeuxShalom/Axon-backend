import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendMail(to: string, subject: string, templateName: string, context: any): Promise<any>;
}
