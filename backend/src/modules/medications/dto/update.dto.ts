import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsString()
  @Length(5, 60)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  dosage?: string;

  @IsOptional()
  @IsString()
  @Length(5, 750)
  instructions?: string;
}
