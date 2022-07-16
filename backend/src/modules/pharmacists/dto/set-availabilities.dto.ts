import { IsArray, IsNotEmpty } from 'class-validator';

export class SetAvailabilitiesDto {
  @IsNotEmpty()
  @IsArray()
  availabilities: string[];
}
