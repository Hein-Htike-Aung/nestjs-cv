import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from './../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const { currentUserId } = request.session;

    if (currentUserId) {
      const user = await this.userService.findById(currentUserId);

      request.currentUser = user;
    }

    return next.handle();
  }
}
