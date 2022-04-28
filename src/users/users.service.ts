import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return await this.repo.save(user);
  }

  async findById(userId: number) {
    if (userId) {
      return await this.findStoredUserById(userId);
    }

    throw new ForbiddenException('There is no logged in user');
  }

  async findUsersEmail(email: string) {
    return await this.repo.find({
      where: {
        email: email,
      },
    });
  }

  async getAllUser() {
    return this.repo.find();
  }

  async update(userId: number, attrs: Partial<User>) {
    const user = await this.findStoredUserById(userId);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async delete(userId: number) {
    const user = await this.findStoredUserById(userId);

    await this.repo.remove(user);
  }

  private async findStoredUserById(userId: number) {
    const storedUser = await this.repo.findOneBy({
      id: userId,
    });

    if (!storedUser) {
      throw new NotFoundException(`User not found with id - ${userId}`);
    }

    return storedUser;
  }
}
