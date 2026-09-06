import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotificationDocument } from './notification.schema';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter?: nodemailer.Transporter;
  private readonly from?: string;

  constructor(configService: ConfigService) {
    const host = configService.get<string>('SMTP_HOST');
    const port = configService.get<string>('SMTP_PORT');
    const user = configService.get<string>('SMTP_USER');
    const pass = configService.get<string>('SMTP_PASS');

    if (!host || !port || !user || !pass) {
      this.logger.warn('SMTP is not configured; report notification emails will not be sent');
      return;
    }

    this.from = configService.get<string>('SMTP_FROM') || user;
    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: configService.get<string>('SMTP_SECURE') === 'true',
      auth: { user, pass },
    });
  }

  async sendReportNotification(notification: NotificationDocument, recipientEmail: string) {
    if (!this.transporter || !this.from) return false;

    await this.transporter.sendMail({
      from: this.from,
      to: recipientEmail,
      subject: notification.title,
      text: notification.message,
    });

    this.logger.log(`Sent report notification email to ${recipientEmail}`);
    return true;
  }
}
