import { Type } from 'class-transformer';
import { ReadPetDto } from '../../pets/dto/read-pet.dto';

export class ReadAppointmentDto {
  id: number;
  date: string;
  service: string;
  observation: string | null;
  @Type(() => ReadPetDto)
  pet: ReadPetDto;
}
