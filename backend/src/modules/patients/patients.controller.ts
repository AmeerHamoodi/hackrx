import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MedicationsService } from '../medications/medications.service';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { UsersService } from '../users/users.service';
import { ReferDto } from './dto';
import { PatientsService } from './patients.service';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly usersService: UsersService,
    private readonly medicationsService: MedicationsService,
  ) {}

  @Roles(Role.Doctor)
  @Post('/refer/:patient/:pharmacist')
  async referPatient(
    @Body() request: ReferDto,
    @Param('patient') patientId: string,
    @Param('pharmacist') pharmacistId: string,
    @Req() httpRequest,
  ) {
    if (!this.usersService.exists({ id: +patientId }))
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Patient not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    if (!this.usersService.exists({ id: +pharmacistId }))
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Pharmacist not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.patientsService.referPatient({
      doctorId: httpRequest.user.id as number,
      pharmacistId: +pharmacistId,
      patientId: +patientId,
      notes: request.notes,
      diagnosis: request.diagnosis,
    });
    const patient = await this.usersService.repository.findOne({
      where: { id: +patientId },
    });

    await Promise.all(
      request.medications.map(async (med) => {
        return await this.medicationsService.create({
          ...med,
          pharmacist: httpRequest.user,
          patient,
        });
      }),
    );

    return {
      message: 'Successfully refered patient to pharmacist',
    };
  }

  @Get('/appointments')
  async getAppointments(@Req() httpRequest) {
    return await this.patientsService.getAppointments(httpRequest.user.id);
  }

  @Roles(Role.Doctor)
  @Get('')
  async getPatients() {
    return await this.patientsService.getPatients();
  }

  @Roles(Role.Pharmacist)
  @Get(':id')
  async getPatient(@Param('id') patientId: string) {
    const patient = await this.usersService.repository.findOne({
      where: { id: +patientId },
      relations: ['medicationsPrescribedToMe'],
    });

    const referal = await this.patientsService.repository.findOne({
      where: { patient: { id: +patientId } },
      relations: ['referringDoctor', 'referringDoctor'],
    });

    delete referal.createdAt;

    return { ...this.usersService.parseUser(patient), referal };
  }
}
