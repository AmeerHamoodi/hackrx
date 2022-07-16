import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Check if email and password are correct
   * @param email user email
   * @param password password
   * @returns {Promise<boolean | User>}
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await compare(password, user.password))) return false;

    return user;
  }

  /**
   * Create user based on registeration parameters
   */
  async registerUser({ firstName, lastName, email, password, role }) {
    const hashedPassword = await hash(password, await genSalt(10));

    const user = await this.usersService.repository.insert({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }

  /**
   * Create jwt token for logged in user
   * @param user Logged in user
   * @returns {string}
   */
  login(user: User) {
    const payload = { id: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }
}
