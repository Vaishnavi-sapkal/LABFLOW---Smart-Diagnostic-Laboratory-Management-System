import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotificationDocument } from './notification.schema';

export type EmailDeliveryResult =
  | { status: 'sent' }
  | { status: 'skipped' }
  | { status: 'failed'; error: string };

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter?: nodemailer.Transporter;
  private readonly from?: string;

  constructor(configService: ConfigService) {
    const host = configService.get<string>('SMTP_HOST');
    const rawPort = configService.get<string>('SMTP_PORT');
    const user = configService.get<string>('SMTP_USER');
    const pass = configService.get<string>('SMTP_PASS');

    const port = rawPort ? Number(rawPort) : NaN;
    if (!host || !user || !pass || !Number.isInteger(port) || port < 1 || port > 65535) {
      this.logger.warn('SMTP is unavailable; notification emails will be skipped (host/user/password/port configuration is incomplete or invalid)');
      return;
    }

    this.from = configService.get<string>('SMTP_FROM') || user;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: this.parseBoolean(configService.get<string>('SMTP_SECURE')),
      auth: { user, pass },
    });
    this.logger.log(`SMTP configured for ${host}:${port}; secure=${this.parseBoolean(configService.get<string>('SMTP_SECURE'))}`);
  }

  async sendNotification(notification: NotificationDocument, recipientEmail: string): Promise<EmailDeliveryResult> {
    if (!this.transporter || !this.from) return { status: 'skipped' };

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: recipientEmail,
        subject: notification.title,
        text: notification.message,
      });
      this.logger.log(`Notification email sent to ${recipientEmail}`);
      return { status: 'sent' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Notification email failed for ${recipientEmail}: ${message}`, error instanceof Error ? error.stack : undefined);
      return { status: 'failed', error: message };
    }
  }

  private parseBoolean(value: string | undefined) {
    return value?.trim().toLowerCase() === 'true';
  }
}
