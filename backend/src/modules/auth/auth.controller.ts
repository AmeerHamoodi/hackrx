import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { PASSWORD_REGEX } from './constants';
import { RegisterDto } from './dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    readonly authService: AuthService,
    readonly usersService: UsersService,
  ) {}

  @Post('/register')
  async register(@Body() request: RegisterDto) {
    if (PASSWORD_REGEX.test(request.password))
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message:
            'Your password must contain at least 8 characters, 1 special character, 1 uppercase character and 1 number',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.authService.registerUser(request);

    return {
      message: 'You have been successfully registered!',
    };
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() request) {
    return {
      user: this.usersService.parseUser(request.user),
      token: this.authService.login(request.user),
    };
  }
}
