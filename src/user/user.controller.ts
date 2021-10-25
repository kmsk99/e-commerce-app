import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.UserService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.UserService.findAll();
  }

  // @Get('/:username')
  // findOne(@Param('username') username: string) {
  //   const user = this.UserService.findOne(username);
  //   return user;
  // }

  // @Patch('/:username')
  // update(
  //   @Param('username') username: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.UserService.update(username, updateUserDto);
  // }

  // @Delete()
  // remove(@Body('username') username: string) {
  //   return this.UserService.remove(username);
  // }
}
