import { IsString, IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class SearchFlightsDto {
  @IsString()
  departure: string;

  @IsString()
  arrival: string;

  @IsDateString()
  departureDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  passengers?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
