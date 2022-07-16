import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { UsersService } from '../users/users.service';
import { CreateDto, UpdateDto } from './dto';
import { MedicationsService } from './medications.service';

@Roles(Role.Pharmacist)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
  constructor(
    private readonly medicationsService: MedicationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/')
  async create(@Body() request: CreateDto, @Req() httpReq: any) {
    // check patients existance
    const patient = await this.usersService.repository.findOne({
      where: { id: request.patientId },
    });

    if (!patient || patient.role !== Role.Patient)
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Could not find patient',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.medicationsService.create({
      ...request,
      pharmacist: httpReq.user,
      patient,
    });

    return {
      message: 'Successfully added medication',
    };
  }

  @Put(':id')
  async update(@Body() request: UpdateDto, @Param('id') medicationId: string) {
    const medication = await this.medicationsService.repository.findOne({
      where: { id: +medicationId },
    });

    if (!medication)
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Medication not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.medicationsService.repository.update(medicationId, request);

    return {
      message: 'Successfully updated medication',
    };
  }

  @Delete(':id')
  async remove(@Param('id') medicationId: string) {
    const medication = await this.medicationsService.repository.findOne({
      where: { id: +medicationId },
    });

    if (!medication)
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Medication not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.medicationsService.repository.remove(medication);

    return {
      message: 'Successfully removed medication',
    };
  }
}
