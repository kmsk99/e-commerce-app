import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get('/:username')
  // findOne(@Param('username') username: string) {
  //   const user = this.usersService.findOne(username);
  //   return user;
  // }

  // @Patch('/:username')
  // update(
  //   @Param('username') username: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.usersService.update(username, updateUserDto);
  // }

  // @Delete()
  // remove(@Body('username') username: string) {
  //   return this.usersService.remove(username);
  // }
}
