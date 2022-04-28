import { User } from './user.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';

const scrypt$ = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup({ email, password }) {
    const user: User[] = await this.userService.findUsersEmail(email);

    if (user.length) {
      throw new ForbiddenException('Email is already taken');
    }

    // Hash Password
    const salt = randomBytes(8).toString('hex');

    const hashPassword = (await scrypt$(password, salt, 32)) as Buffer;

    const finalPassword = salt + '.' + hashPassword.toString('hex');

    return await this.userService.createUser(email, finalPassword);
  }

  async signin({ email, password }) {
    const [user] = await this.userService.findUsersEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // verify password
    const [salt, storedHash] = user.password.split('.');

    const hashPassword = (await scrypt$(password, salt, 32)) as Buffer;

    if (hashPassword.toString('hex') !== storedHash) {
      throw new ForbiddenException('incorrect password');
    }

    return user;
  }
}
