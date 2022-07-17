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
import { SetAvailabilitiesDto, SetNoteDto } from './dto';
import { PharmacistsService } from './pharmacists.service';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('pharmacists')
export class PharmacistsController {
  constructor(
    private readonly pharmacistsService: PharmacistsService,
    private readonly medicationsService: MedicationsService,
  ) {}

  @Roles(Role.Pharmacist)
  @Post('/availabilities')
  async setAvailabilities(
    @Body() request: SetAvailabilitiesDto,
    @Req() httpRequest,
  ) {
    await this.pharmacistsService.clearAvailabilities(httpRequest.user.id);
    await this.pharmacistsService.insertAvailabilities(
      request.availabilities,
      httpRequest.user,
    );

    return {
      message: 'Successfully set your availabilites',
    };
  }

  @Roles(Role.Patient)
  @Post('/book/:availability')
  async bookAvailability(
    @Param('availability') availabilityId: string,
    @Req() httpRequest,
  ) {
    await this.pharmacistsService.patientBookAvailability(
      availabilityId,
      httpRequest.user,
    );

    return {
      message: 'Successfully booked appointment with pharmacist',
    };
  }

  @Get('/availabilities/:month')
  async getAvailabilities(@Param('month') month: string, @Req() httpRequest) {
    const avals = await this.pharmacistsService.getPatientAvailabilities(
      httpRequest.user.id,
      month,
    );

    if (!avals)
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Patient has not been referred to a pharmacist yet',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return avals;
  }

  @Get('/self-availabilities')
  async getSelfAvailabilities(@Req() httpRequest) {
    return await this.pharmacistsService.getSelfAvailabilities(
      httpRequest.user.id,
    );
  }

  @Get('/appointments/')
  async getAppointments(@Req() httpRequest) {
    return await this.pharmacistsService.getAppointments(httpRequest.user.id);
  }

  @Roles(Role.Pharmacist)
  @Post('/note/:referalId')
  async setNote(
    @Body() request: SetNoteDto,
    @Param('referalId') referalId: string,
  ) {
    const referal = await this.pharmacistsService.repository.findOne({
      where: { id: +referalId },
    });

    const response = await this.pharmacistsService.noteRepository.insert({
      content: request.content,
      referal,
    });

    return response.identifiers[0];
  }

  @Roles(Role.Pharmacist)
  @Get('/note/:id')
  async getNote(@Param('id') id: string) {
    const note = await this.pharmacistsService.noteRepository.findOne({
      where: { id: +id },
      relations: ['referal.pharmacist', 'referal.patient'],
    });
    const medications = await this.medicationsService.repository.find({
      where: {
        patient: { id: note.referal.patient.id },
        pharmacist: { id: note.referal.pharmacist.id },
      },
    });

    return { note, medications };
  }
}
