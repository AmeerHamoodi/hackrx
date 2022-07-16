import { Test, TestingModule } from '@nestjs/testing';
import { PharmacistsController } from './pharmacists.controller';

describe('PharmacistsController', () => {
  let controller: PharmacistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacistsController],
    }).compile();

    controller = module.get<PharmacistsController>(PharmacistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
