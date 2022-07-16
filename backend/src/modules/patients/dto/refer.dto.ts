import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateDto as Medication } from 'src/modules/medications/dto';

export class ReferDto {
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  diagnosis: string;

  @Type(() => Medication)
  @ValidateNested()
  medications: Medication[];
}
