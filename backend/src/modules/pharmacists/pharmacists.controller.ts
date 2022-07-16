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
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { SetAvailabilitiesDto } from './dto';
import { PharmacistsService } from './pharmacists.service';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('pharmacists')
export class PharmacistsController {
  constructor(private readonly pharmacistsService: PharmacistsService) {}

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
}
