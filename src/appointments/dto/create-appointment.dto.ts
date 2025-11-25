import {
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  service: string;

  @IsString()
  @IsEmpty()
  observation?: string;

  @IsNotEmpty()
  @IsNumber()
  petId: number;
}
