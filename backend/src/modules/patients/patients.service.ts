import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PharmacistsService } from '../pharmacists/pharmacists.service';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Referal } from './entities/referal.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Referal)
    readonly repository: Repository<Referal>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PharmacistsService))
    private readonly pharmacistsService: PharmacistsService,
  ) {}

  /**
   * Creates a referal entry based on doctor, patient and pharmacist + notes
   */
  async referPatient({
    doctorId,
    patientId,
    pharmacistId,
    notes = null,
    diagnosis,
  }: {
    doctorId: number;
    patientId: number;
    pharmacistId: number;
    notes?: string | null;
    diagnosis: string;
  }) {
    const doctor = await this.usersService.repository.findOne({
      where: { id: doctorId },
    });
    const patient = await this.usersService.repository.findOne({
      where: { id: patientId },
    });
    const pharmacist = await this.usersService.repository.findOne({
      where: { id: pharmacistId },
    });

    await this.repository.insert({
      referringDoctor: doctor,
      patient,
      pharmacist,
      notes,
      diagnosis,
    });
  }

  async getAppointments(patientId: string) {
    return (
      await this.pharmacistsService.repository.find({
        where: { patient: { id: +patientId } },
        relations: ['pharmacist'],
        select: ['date', 'pharmacist'],
      })
    ).map((app) => {
      app.pharmacist = this.usersService.parseUser(app.pharmacist) as any;
      return app;
    });
  }

  async getPatients() {
    const users = await this.usersService.repository.find({
      where: { role: Role.Patient },
    });
    const patients = Promise.all(
      users.map((user) => {
        const p = this.usersService.parseUser(user) as any;
        return this.repository
          .findOne({
            where: { patient: { id: user.id } },
            relations: ['pharmacist'],
          })
          .then((referal) => {
            p.pharmacist = referal
              ? this.usersService.parseUser(referal.pharmacist)
              : null;
            return p;
          });
      }),
    );

    return patients;
  }
}
