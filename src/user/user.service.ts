import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.emailExists({ email: createUserDto.email });
    if (emailExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.users.create({ data: createUserDto });
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const emailExists = await this.emailExists({
        email: updateUserDto.email,
        id,
      });
      if (emailExists) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
    }

    delete updateUserDto.id;

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
    return updatedUser;
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.users.delete({ where: { id } });
      return deleted;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  private async searchByEmail(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  private async emailExists({
    email,
    id,
  }: {
    email: string;
    id?: number;
  }): Promise<boolean> {
    const user = await this.searchByEmail(email);
    if (id && id == user?.id) {
      return false;
    }
    return user !== null;
  }
}
