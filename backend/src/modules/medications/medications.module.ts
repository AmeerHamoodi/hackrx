import { Module } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [MedicationsService],
  controllers: [MedicationsController],
  imports: [TypeOrmModule.forFeature([Medication]), UsersModule],
})
export class MedicationsModule {}
