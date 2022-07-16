import { forwardRef, Module } from '@nestjs/common';
import { PharmacistsService } from './pharmacists.service';
import { PharmacistsController } from './pharmacists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { UsersModule } from '../users/users.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  providers: [PharmacistsService],
  controllers: [PharmacistsController],
  imports: [
    TypeOrmModule.forFeature([Availability]),
    UsersModule,
    forwardRef(() => PatientsModule),
  ],
  exports: [PharmacistsService],
})
export class PharmacistsModule {}
