import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Availability } from './entities/availability.entity';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone.js';
import { UsersService } from '../users/users.service';
import { PatientsService } from '../patients/patients.service';
import { PharmacistNote } from '../patients/entities/pharmacist-note.entity';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class PharmacistsService {
  constructor(
    @InjectRepository(Availability)
    readonly repository: Repository<Availability>,
    @InjectRepository(PharmacistNote)
    readonly noteRepository: Repository<PharmacistNote>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientsService: PatientsService,
  ) {}

  async clearAvailabilities(pharmacistId: string) {
    const avals = await this.repository.find({
      where: { pharmacist: { id: +pharmacistId } },
    });
    await this.repository.remove(avals);
  }

  async insertAvailabilities(availabilities: string[], pharmacist: User) {
    const availabilityObjects = availabilities.map((aval) => {
      let date = dayjs(aval);
      const avalObjects = [];

      while (dayjs(date).diff(aval, 'months') < 3) {
        avalObjects.push({ pharmacist, date: dayjs(date).toISOString() });
        date = dayjs(date).add(1, 'week');
      }

      return avalObjects;
    });

    await this.repository.insert(availabilityObjects.flat());
  }

  async patientBookAvailability(availabilityId: string, patient: User) {
    await this.repository.update(availabilityId, {
      patient,
    });
  }

  async getPatientAvailabilities(patientId: string, month: string) {
    const date = dayjs()
      .set('month', +month)
      .endOf('month')
      .endOf('day')
      .toISOString();

    const referal = await this.patientsService.repository.findOne({
      where: { patient: { id: +patientId } },
      relations: ['pharmacist'],
      select: ['pharmacist'],
    });

    if (!referal) return false;

    return await this.repository.find({
      where: {
        pharmacist: { id: +referal.pharmacist.id },
        patient: null,
        date: LessThan(date),
      },
      select: ['id', 'date', 'createdAt', 'updatedAt'],
    });
  }

  async getSelfAvailabilities(pharmacistId: string) {
    const limitingDate = dayjs().add(1, 'week').endOf('week').toISOString();

    return await this.repository.find({
      where: {
        date: LessThan(limitingDate),
        pharmacist: { id: +pharmacistId },
      },
      select: ['date'],
    });
  }

  async getAppointments(pharmacistId: string) {
    return (
      await this.repository.find({
        where: { patient: true, pharmacist: { id: +pharmacistId } },
        relations: ['patient'],
        select: ['date'],
      })
    ).map((app) => {
      app.patient = this.usersService.parseUser(app.patient) as any;
      return app;
    });
  }
}
