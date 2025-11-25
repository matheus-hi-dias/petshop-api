import { Transform } from 'class-transformer';

export class ReadPetDto {
  id: number;
  name: string;
  species: string;
  age: number;
  observation: string | null;
  userId: number;

  @Transform(({ value }: { value: number }) => value / 1000)
  weight: number;
}
