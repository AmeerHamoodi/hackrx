import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 60)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  dosage: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 750)
  instructions: string;

  @IsNotEmpty()
  @IsNumber()
  patientId: number;
}
