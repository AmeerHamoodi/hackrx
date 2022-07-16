import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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
   * Performs count query to determine existance of user by email (faster than fetching everything)
   * @param email user email
   * @returns {User | null}
   */
  async exists(condition: FindOptionsWhere<User>) {
    return (await this.repository.count({ where: condition })) > 0;
  }

  /**
   * Returns only the visible fields (Laravel API resource but JS)
   * @param user
   * @returns {object}
   */
  parseUser(user: User) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }
}
