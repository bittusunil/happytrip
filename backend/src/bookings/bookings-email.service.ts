import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsEmailService {
  constructor(private emailService: EmailService) {}

  async sendBookingConfirmationEmail(
    userEmail: string,
    firstName: string,
    bookingData: CreateBookingDto & { bookingId: string; referenceId: string },
  ): Promise<void> {
    try {
      await this.emailService.sendBookingConfirmationEmail(userEmail, firstName, {
        ...bookingData,
        status: 'confirmed',
      });
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      // Don't throw - booking should succeed even if email fails
    }
  }

  async sendBookingCancellationEmail(
    userEmail: string,
    firstName: string,
    bookingData: any,
  ): Promise<void> {
    try {
      await this.emailService.sendBookingCancellationEmail(
        userEmail,
        firstName,
        bookingData,
      );
    } catch (error) {
      console.error('Failed to send booking cancellation email:', error);
    }
  }

  async sendBookingReminderEmail(
    userEmail: string,
    firstName: string,
    bookingData: any,
  ): Promise<void> {
    try {
      await this.emailService.sendBookingReminderEmail(
        userEmail,
        firstName,
        bookingData,
      );
    } catch (error) {
      console.error('Failed to send booking reminder email:', error);
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.emailService.sendWelcomeEmail(email, firstName);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string,
  ): Promise<void> {
    try {
      await this.emailService.sendPasswordResetEmail(email, firstName, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  async sendEmailVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string,
  ): Promise<void> {
    try {
      await this.emailService.sendEmailVerificationEmail(
        email,
        firstName,
        verificationToken,
      );
    } catch (error) {
      console.error('Failed to send email verification email:', error);
    }
  }
}
