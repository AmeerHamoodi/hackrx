import { forwardRef, Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referal } from './entities/referal.entity';
import { PharmacistsModule } from '../pharmacists/pharmacists.module';

@Module({
  providers: [PatientsService],
  controllers: [PatientsController],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Referal]),
    forwardRef(() => PharmacistsModule),
  ],
  exports: [PatientsService],
})
export class PatientsModule {}
