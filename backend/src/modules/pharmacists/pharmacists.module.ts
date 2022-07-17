import { forwardRef, Module } from '@nestjs/common';
import { PharmacistsService } from './pharmacists.service';
import { PharmacistsController } from './pharmacists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { UsersModule } from '../users/users.module';
import { PatientsModule } from '../patients/patients.module';
import { PharmacistNote } from '../patients/entities/pharmacist-note.entity';
import { MedicationsModule } from '../medications/medications.module';
import { Suggestion } from '../patients/entities/suggestion.entity';

@Module({
  providers: [PharmacistsService],
  controllers: [PharmacistsController],
  imports: [
    TypeOrmModule.forFeature([Availability, PharmacistNote, Suggestion]),
    UsersModule,
    forwardRef(() => PatientsModule),
    MedicationsModule,
  ],
  exports: [PharmacistsService],
})
export class PharmacistsModule {}
