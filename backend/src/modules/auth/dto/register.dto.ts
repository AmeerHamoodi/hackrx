import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsString,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  password: string;

  @IsOptional()
  @IsString()
  doxyLink?: string;
}
