import { IsEmail, IsNotEmpty, Length, IsString } from 'class-validator';
import { IsUnique } from 'src/shared/decorators/unique.decorator';

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
}
