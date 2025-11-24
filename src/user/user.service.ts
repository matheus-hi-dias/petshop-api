import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  private readonly logger = new Logger(UserService.name);
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const emailExists = await this.emailExists({
        email: createUserDto.email,
      });
      if (emailExists) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await hash(
        createUserDto.password,
        this.saltRounds,
      );

      const userData = {
        ...createUserDto,
        password: hashedPassword,
      };

      return await this.prisma.users.create({ data: userData });
    } catch (error) {
      this.logger.error('Error creating user', error as string);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.email) {
        const emailExists = await this.emailExists({
          email: updateUserDto.email,
          id,
        });
        if (emailExists) {
          throw new HttpException(
            'Email already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if ('password' in updateUserDto) {
        throw new HttpException(
          'Password cannot be updated',
          HttpStatus.BAD_REQUEST,
        );
      }

      delete updateUserDto.id;

      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error: unknown) {
      this.logger.error('Error updating user', error as string);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.users.delete({ where: { id } });
      return deleted;
    } catch (error: unknown) {
      this.logger.error('Error deleting user', error as string);
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
