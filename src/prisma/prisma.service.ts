import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  constructor(private configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.get<string>('DATABASE_HOST'),
      user: configService.get<string>('DATABASE_USER'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
      port: configService.get<number>('DATABASE_PORT'),
      connectionLimit: 10,
    });
    super({ adapter });
    this.logger.log('MariaDB adapter configured: ', adapter);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
