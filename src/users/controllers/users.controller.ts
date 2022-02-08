import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SerializeInterceptor } from '../../interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post('/signup')
  create(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/:id')
  async find(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get()
  findAll(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
