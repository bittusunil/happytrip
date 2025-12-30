import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsObject()
  bookingDetails?: Record<string, any>;
}
