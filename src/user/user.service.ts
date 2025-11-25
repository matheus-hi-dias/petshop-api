import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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

  async findOne(id: number) {
    return await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        pets: true,
      },
    });
  }

  async searchByEmail(email: string) {
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
