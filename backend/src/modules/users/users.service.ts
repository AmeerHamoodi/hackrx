import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
  ) {}

  /**
   * Find user by email
   * @param email user email
   * @returns {User | null}
   */
  async findByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }

  /**
   * Returns only the visible fields (Laravel API resource but JS)
   * @param user
   * @returns {object}
   */
  parseUser(user: User) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
