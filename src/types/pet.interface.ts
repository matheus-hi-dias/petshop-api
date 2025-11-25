export interface PetFromPrisma {
  id: number;
  name: string;
  species: string;
  age: number;
  weight: number;
  observation: string | null;
  userId: number;
}
