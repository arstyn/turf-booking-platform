import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  turfId: string;

  @IsDateString()
  bookingDate: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

