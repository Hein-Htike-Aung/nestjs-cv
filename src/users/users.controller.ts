import { AuthGuard } from './../guards/auth.guard';
import { CurrentUserInterceptor } from './../interceptors/current-user.interceptor';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto as AuthUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { Serialize } from '../decoators/serialize.decorator';
import { CurrentUser } from '../decoators/current-user.decorator';

@Serialize(UserDto)
@Controller('auth')
// @UseInterceptors(CurrentUserInterceptor) // Use Interceptor for Specific Class
export class UsersController {
  constructor(
    private service: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  createUser(@Body() authUserDto: AuthUserDto) {
    return this.authService.signup(authUserDto);
  }

  // Use Cookie
  @Post('signin')
  async signin(@Body() authUserDto: AuthUserDto, @Session() session: any) {
    const user = await this.authService.signin(authUserDto);
    session.currentUserId = user.id;
    return user;
  }

  // @Get('current-user')
  // getCurrentUser(@Session() session: any) {
  //   return this.service.findById(session.currentUserId);
  // }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: User) {    
    return user;
  }

  @Get('logout')
  logout(@Session() session: any) {
    session.currentUserId = null;
  }

  // Use Custom Interceptor
  // @UseInterceptors(new SerializeInterceptor(UserDto)) // use custom Decorator instead
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  // use Default
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @UseGuards(AuthGuard)
  getAll(@Query('email') email: any) {
    return this.service.findUsersEmail(email);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getAllUser() {
    return this.service.getAllUser();
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.service.update(userId, updateUserDto);
  }

  @HttpCode(204)
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) userId: number) {
    return this.service.delete(userId);
  }
}
