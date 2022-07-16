import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../users/entities/user.entity';
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

  @Post('/register/:role?')
  async register(@Body() request: RegisterDto, @Param('role') role?: Role) {
    let userObject = { ...request } as any;

    if (Object.values(Role).includes(role))
      userObject = { ...userObject, role };

    if (PASSWORD_REGEX.test(request.password))
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message:
            'Your password must contain at least 8 characters, 1 special character, 1 uppercase character and 1 number',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    if (await this.usersService.findByEmail(request.email))
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Someone with this email already exists on our platform',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.authService.registerUser(userObject);

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
