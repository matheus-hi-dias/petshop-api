import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentFindAllQueryParams } from 'src/types/appointmentParams.interface';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);
  constructor(private readonly prismaService: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const appointment = await this.prismaService.appointments.create({
        data: {
          ...createAppointmentDto,
          date: String(createAppointmentDto.date),
        },
        select: {
          id: true,
          date: true,
          service: true,
          observation: true,
          pet: true,
        },
      });
      return appointment;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Pet with ID ${createAppointmentDto.petId} not found. Cannot create appointment.`,
        );
      }
      this.logger.error('Failed to create appointment', error);
      throw error;
    }
  }

  findAll(params: AppointmentFindAllQueryParams) {
    try {
      const searchParams = {};

      if (params.date) {
        searchParams['date'] = params.date;
      }

      if (params.service) {
        searchParams['service'] = params.service;
      }

      if (params.petId) {
        searchParams['petId'] = Number(params.petId);
      }

      const appointments = this.prismaService.appointments.findMany({
        where: searchParams,
      });
      return appointments;
    } catch (error) {
      this.logger.error('Failed to find appointments', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const appointment = await this.prismaService.appointments.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new Error(`Appointment with ID ${id} not found.`);
    }

    return appointment;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const appointment = this.prismaService.appointments.update({
        where: { id },
        data: {
          ...updateAppointmentDto,
          date: String(updateAppointmentDto.date),
        },
        select: {
          id: true,
          date: true,
          service: true,
          observation: true,
          pet: true,
        },
      });
      return appointment;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Appointment with ID ${id} not found.`);
      }
      this.logger.error(`Failed to update pet ${id}`, error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.appointments.delete({ where: { id } });
      return { message: `Appointment with ID ${id} removed successfully.` };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Appointment with ID ${id} not found.`);
      }
      this.logger.error(`Failed to delete appointment ${id}`, error);
      throw error;
    }
  }
}
