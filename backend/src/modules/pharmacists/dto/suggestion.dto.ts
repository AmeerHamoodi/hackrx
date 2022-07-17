import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SuggestionDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  medicationId: number;
}
