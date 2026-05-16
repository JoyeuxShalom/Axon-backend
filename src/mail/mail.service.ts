import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  /**
   * Sends an email using a Handlebars template
   * @param to Recipient email
   * @param subject Email subject
   * @param templateName Name of the template file (without .hbs)
   * @param context Data to inject into the template
   */
  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ) {
    try {
      // 1. Resolve template path
      const templatePath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
        `${templateName}.hbs`,
      );

      // 2. Read and compile template
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templateName}`);
      }

      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate(context);

      // 3. Send email
      const info = await this.transporter.sendMail({
        from: `"Axon Medical" <${this.configService.get<string>('MAIL_FROM')}>`,
        to,
        subject,
        html,
      });

      console.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new InternalServerErrorException(`Failed to send email: ${error.message}`);
    }
  }
}
