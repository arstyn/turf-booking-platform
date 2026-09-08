import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../database/entities/otp.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  private readonly isProduction: boolean;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private emailService: EmailService,
  ) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Store OTP in database
   */

  /**
   * Send OTP via SMS (production) or return it directly (development)
   */
  async sendSmsOtp(phone: string, otp: string): Promise<boolean> {
    if (!this.isProduction) {
      // In development, just log the OTP
      console.log(`[DEV] SMS OTP for ${phone}: ${otp}`);
      return true;
    }

    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    // For now, return true (implement actual SMS service)
    console.log(`[PROD] SMS OTP for ${phone}: ${otp}`);
    return true;
  }

  /**
   * Send OTP via Email using the redesigned modern template
   */
  async sendEmailOtp(email: string, otp: string): Promise<boolean> {
    return this.emailService.sendOtpEmail(email, otp, 10);
  }

  /**
   * Store OTP with expiration (10 minutes)
   */
  async storeOtp(identifier: string, otpCode: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Clean up any existing OTPs to prevent duplicates and race conditions
    await this.otpRepository.delete({ identifier });

    const newOtp = this.otpRepository.create({
      identifier,
      otp: otpCode,
      expiresAt,
      attempts: 0,
    });
    await this.otpRepository.save(newOtp);
  }

  /**
   * Verify OTP
   */
  async verifyOtp(identifier: string, otpCode: string): Promise<boolean> {
    const isDummyAccount =
      identifier === 'phone:+19999999999' ||
      identifier === 'phone:+18888888888' ||
      identifier === 'email:playstore_user@example.com' ||
      identifier === 'email:playstore_owner@turf.com';

    if (isDummyAccount && otpCode === '123456') {
      return true;
    }

    const stored = await this.otpRepository.findOne({
      where: { identifier },
      order: { createdAt: 'DESC' },
    });

    if (!stored) {
      return false;
    }

    if (new Date() > stored.expiresAt) {
      await this.otpRepository.delete(stored.id);
      return false;
    }

    if (stored.attempts >= 5) {
      await this.otpRepository.delete(stored.id);
      return false;
    }

    stored.attempts++;

    if (stored.otp !== otpCode) {
      await this.otpRepository.save(stored);
      return false;
    }

    // OTP verified successfully, remove it
    await this.otpRepository.delete(stored.id);
    return true;
  }

  /**
   * Request OTP for phone
   */
  async requestPhoneOtp(phone: string): Promise<{ expiresIn: number }> {
    if (phone === '+19999999999' || phone === '+18888888888') {
      return { expiresIn: 600 };
    }
    const otpCode = this.generateOtp();
    await this.sendSmsOtp(phone, otpCode);
    await this.storeOtp(`phone:${phone}`, otpCode);
    return { expiresIn: 600 }; // 10 minutes
  }

  /**
   * Request OTP for email
   */
  async requestEmailOtp(email: string): Promise<{ expiresIn: number }> {
    if (
      email === 'playstore_user@example.com' ||
      email === 'playstore_owner@turf.com'
    ) {
      return { expiresIn: 600 };
    }
    const otpCode = this.generateOtp();
    await this.sendEmailOtp(email, otpCode);
    await this.storeOtp(`email:${email}`, otpCode);
    return { expiresIn: 600 }; // 10 minutes
  }

  /**
   * Verify phone OTP
   */
  async verifyPhoneOtp(phone: string, otpCode: string): Promise<boolean> {
    return this.verifyOtp(`phone:${phone}`, otpCode);
  }

  /**
   * Verify email OTP
   */
  async verifyEmailOtp(email: string, otpCode: string): Promise<boolean> {
    return this.verifyOtp(`email:${email}`, otpCode);
  }
}
