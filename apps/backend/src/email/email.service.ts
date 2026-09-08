import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  BookingConfirmationOptions,
  renderAdminResponseEmail,
  renderBookingConfirmationEmail,
  renderContactNotificationEmail,
  renderOtpEmail,
} from './email-templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend?: Resend;
  private readonly fromEmail: string;
  private readonly isProduction: boolean;
  private readonly frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn(
        'RESEND_API_KEY is not configured. Outbound emails will only be logged.',
      );
    }

    const configuredFrom =
      this.configService.get<string>('EMAIL_FROM') ||
      'no-reply@lockkiyajaye.com';
    // Ensure the sender displays as "Lock Kiya Jaye <email>" if not already formatted
    this.fromEmail = configuredFrom.includes('<')
      ? configuredFrom
      : `Lock Kiya Jaye <${configuredFrom}>`;

    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://lockkiyajaye.com';
  }

  /**
   * Helper to resolve public brand logo URL for outbound emails.
   * Uses hosted public HTTPS URL so that Gmail, Apple Mail, and Outlook
   * can fetch and display it cleanly without broken images or file attachment prompts.
   */
  private getLogoUrl(): string {
    const configuredLogo = this.configService.get<string>('LOGO_URL');
    if (configuredLogo) {
      return configuredLogo;
    }

    if (
      this.frontendUrl &&
      !this.frontendUrl.includes('localhost') &&
      !this.frontendUrl.includes('127.0.0.1')
    ) {
      return `${this.frontendUrl}/logo.png`;
    }

    return 'https://lockkiyajaye.com/logo.png';
  }

  /**
   * Generic mail sender wrapping Resend with dev logging and graceful fallback
   */
  async sendEmail(params: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: any[];
  }): Promise<boolean> {
    const recipients = Array.isArray(params.to) ? params.to : [params.to];

    // Always log in development for immediate visibility
    if (!this.isProduction) {
      this.logger.log(
        `[DEV EMAIL] Outgoing to [${recipients.join(', ')}] | Subject: "${params.subject}"`,
      );
    }

    if (!this.resend) {
      if (this.isProduction) {
        this.logger.error(
          'Cannot send email in production: RESEND_API_KEY is missing',
        );
        return false;
      }
      return true;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: recipients,
        subject: params.subject,
        html: params.html,
        text: params.text,
        attachments: params.attachments,
      });

      if (error) {
        this.logger.error(
          `Resend email delivery failed: ${error.message} (code: ${error.name})`,
          error,
        );
        // In dev mode, return true so authentication/flows don't get blocked if sender domain is unverified
        return !this.isProduction;
      }

      this.logger.log(
        `Email successfully sent via Resend. Message ID: ${data?.id}`,
      );
      return true;
    } catch (err: any) {
      this.logger.error(
        `Unexpected error during email delivery: ${err?.message || err}`,
        err?.stack,
      );
      return !this.isProduction;
    }
  }

  /**
   * Send One-Time Password (OTP) verification email
   */
  async sendOtpEmail(
    email: string,
    otp: string,
    expiresInMinutes: number = 10,
  ): Promise<boolean> {
    const logoUrl = this.getLogoUrl();
    const { html, text } = renderOtpEmail({
      otp,
      recipientEmail: email,
      expiresInMinutes,
      frontendUrl: this.frontendUrl,
      logoUrl,
    });

    this.logger.log(
      `[OTP VERIFICATION] Generated OTP ${otp} for ${email} (valid ${expiresInMinutes}m)`,
    );

    return this.sendEmail({
      to: email,
      subject: `${otp} is your Lock Kiya Jaye verification code`,
      html,
      text,
    });
  }

  /**
   * Send contact form notification to admin
   */
  async sendContactNotification(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@lockkiyajaye.com';
    const logoUrl = this.getLogoUrl();
    const { html, text } = renderContactNotificationEmail({
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      frontendUrl: this.frontendUrl,
      submittedAt: new Date(),
      logoUrl,
    });

    return this.sendEmail({
      to: adminEmail,
      subject: `[New Inquiry] ${contactData.subject} from ${contactData.name}`,
      html,
      text,
    });
  }

  /**
   * Send admin support response to customer
   */
  async sendAdminResponse(responseData: {
    customerEmail: string;
    customerName: string;
    subject: string;
    adminResponse: string;
    respondedBy: string;
  }): Promise<boolean> {
    const logoUrl = this.getLogoUrl();
    const { html, text } = renderAdminResponseEmail({
      customerName: responseData.customerName,
      customerEmail: responseData.customerEmail,
      subject: responseData.subject,
      adminResponse: responseData.adminResponse,
      respondedBy: responseData.respondedBy,
      frontendUrl: this.frontendUrl,
      respondedAt: new Date(),
      logoUrl,
    });

    return this.sendEmail({
      to: responseData.customerEmail,
      subject: `Re: ${responseData.subject} - Lock Kiya Jaye Support`,
      html,
      text,
    });
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(
    bookingData: BookingConfirmationOptions & { email: string },
  ): Promise<boolean> {
    const logoUrl = this.getLogoUrl();
    const { html, text } = renderBookingConfirmationEmail({
      ...bookingData,
      frontendUrl: this.frontendUrl,
      logoUrl,
    });

    const shortId = bookingData.bookingId
      ? bookingData.bookingId.slice(-6).toUpperCase()
      : '';

    return this.sendEmail({
      to: bookingData.email,
      subject: `Booking Confirmed! ⚽ ${bookingData.turfName}${shortId ? ` (#${shortId})` : ''}`,
      html,
      text,
    });
  }
}
