import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from 'generated/prisma/client';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReadPetDto } from './dto/read-pet.dto';

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPetDto: CreatePetDto, userId: number) {
    const pet = await this.prismaService.pets.create({
      data: { ...createPetDto, userId },
    });

    return plainToInstance(ReadPetDto, pet);
  }

  async findAll() {
    try {
      const pets = await this.prismaService.pets.findMany();
      return plainToInstance(ReadPetDto, pets);
    } catch (error) {
      this.logger.error('Failed to retrieve pets', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const pet = await this.prismaService.pets.findUnique({
      where: { id },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found.`);
    }

    return plainToInstance(ReadPetDto, pet);
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    try {
      const pet = await this.prismaService.pets.update({
        where: { id },
        data: updatePetDto,
      });

      return plainToInstance(ReadPetDto, pet);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Pet with ID ${id} not found.`);
      }
      this.logger.error(`Failed to update pet ${id}`, error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.pets.delete({ where: { id } });
      return { message: `Pet with ID ${id} removed successfully.` };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Pet with ID ${id} not found.`);
      }
      this.logger.error(`Failed to delete pet ${id}`, error);
      throw error;
    }
  }
}
