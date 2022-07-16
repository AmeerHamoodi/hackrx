import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Medication } from './entities/medication.entity';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    public readonly repository: Repository<Medication>,
  ) {}

  create(parameters: QueryDeepPartialEntity<Medication>) {
    return this.repository.insert(parameters);
  }
}
