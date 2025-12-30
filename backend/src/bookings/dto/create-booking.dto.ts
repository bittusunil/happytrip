import { IsEnum, IsString, IsNumber, IsDateString, IsOptional, IsObject } from 'class-validator';
import { BookingType } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsEnum(BookingType)
  type: BookingType;

  @IsString()
  referenceId: string;

  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @IsOptional()
  @IsObject()
  bookingDetails?: Record<string, any>;

  @IsOptional()
  @IsString()
  notes?: string;
}
