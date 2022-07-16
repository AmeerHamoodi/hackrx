import { Test, TestingModule } from '@nestjs/testing';
import { PharmacistsService } from './pharmacists.service';

describe('PharmacistsService', () => {
  let service: PharmacistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PharmacistsService],
    }).compile();

    service = module.get<PharmacistsService>(PharmacistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
