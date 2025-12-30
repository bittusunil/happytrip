import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const mailHost = this.configService.get('MAIL_HOST');
    const mailPort = this.configService.get('MAIL_PORT');
    const mailUser = this.configService.get('MAIL_USER');
    const mailPassword = this.configService.get('MAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: parseInt(mailPort),
      secure: false,
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM') || 'noreply@happytrip.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const html = `
      <h1>Welcome to HappyTrip!</h1>
      <p>Hi ${firstName},</p>
      <p>Thank you for joining HappyTrip. We're excited to help you discover amazing travel experiences.</p>
      <p>Get started by searching for flights and accommodations across Europe.</p>
      <a href="${this.configService.get('FRONTEND_URL')}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Exploring</a>
      <p>Best regards,<br>The HappyTrip Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to HappyTrip!',
      html,
    });
  }

  async sendBookingConfirmationEmail(
    email: string,
    firstName: string,
    bookingDetails: any,
  ): Promise<void> {
    const html = `
      <h1>Booking Confirmation</h1>
      <p>Hi ${firstName},</p>
      <p>Your booking has been confirmed! Here are your details:</p>
      
      <h2>Booking Details</h2>
      <p><strong>Reference ID:</strong> ${bookingDetails.referenceId}</p>
      <p><strong>Type:</strong> ${bookingDetails.type === 'flight' ? 'Flight' : 'Accommodation'}</p>
      <p><strong>Total Price:</strong> ${bookingDetails.totalPrice} ${bookingDetails.currency}</p>
      <p><strong>Status:</strong> ${bookingDetails.status}</p>
      
      ${bookingDetails.checkInDate ? `<p><strong>Check-in:</strong> ${new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>` : ''}
      ${bookingDetails.checkOutDate ? `<p><strong>Check-out:</strong> ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>` : ''}
      
      <p>You can view your booking details in your account:</p>
      <a href="${this.configService.get('FRONTEND_URL')}/bookings/${bookingDetails.bookingId}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Booking</a>
      
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>The HappyTrip Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: `Booking Confirmation - ${bookingDetails.referenceId}`,
      html,
    });
  }

  async sendBookingCancellationEmail(
    email: string,
    firstName: string,
    bookingDetails: any,
  ): Promise<void> {
    const html = `
      <h1>Booking Cancellation</h1>
      <p>Hi ${firstName},</p>
      <p>Your booking has been cancelled.</p>
      
      <h2>Cancelled Booking Details</h2>
      <p><strong>Reference ID:</strong> ${bookingDetails.referenceId}</p>
      <p><strong>Type:</strong> ${bookingDetails.type === 'flight' ? 'Flight' : 'Accommodation'}</p>
      <p><strong>Original Price:</strong> ${bookingDetails.totalPrice} ${bookingDetails.currency}</p>
      
      <p>If this was unintentional or you need assistance, please contact our support team.</p>
      <p>Best regards,<br>The HappyTrip Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: `Booking Cancelled - ${bookingDetails.referenceId}`,
      html,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string,
  ): Promise<void> {
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    const html = `
      <h1>Password Reset Request</h1>
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      
      <a href="${resetLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The HappyTrip Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }

  async sendEmailVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string,
  ): Promise<void> {
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verificationToken}`;

    const html = `
      <h1>Verify Your Email</h1>
      <p>Hi ${firstName},</p>
      <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
      
      <a href="${verificationLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>The HappyTrip Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      html,
    });
  }

  async sendBookingReminderEmail(
    email: string,
    firstName: string,
    bookingDetails: any,
  ): Promise<void> {
    const daysUntilBooking = Math.ceil(
      (new Date(bookingDetails.checkInDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    const html = `
      <h1>Upcoming ${bookingDetails.type === 'flight' ? 'Flight' : 'Accommodation'}</h1>
      <p>Hi ${firstName},</p>
      <p>Your ${bookingDetails.type === 'flight' ? 'flight' : 'accommodation'} is coming up in ${daysUntilBooking} days!</p>
      
      <h2>Booking Details</h2>
      <p><strong>Reference ID:</strong> ${bookingDetails.referenceId}</p>
      <p><strong>Date:</strong> ${new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
      
      <p>Make sure to:</p>
      <ul>
        <li>Check your booking details</li>
        <li>Prepare required documents</li>
        <li>Arrange transportation if needed</li>
      </ul>
      
      <a href="${this.configService.get('FRONTEND_URL')}/bookings/${bookingDetails.bookingId}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Booking</a>
      
      <p>Best regards,<br>The HappyTrip Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: `Reminder: Your ${bookingDetails.type === 'flight' ? 'flight' : 'accommodation'} is coming up!`,
      html,
    });
  }
}
