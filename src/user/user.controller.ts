import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.UserService.findAll();
  // }

  // @Get(':username')
  // findOne(@Param('username') username: string) {
  //   const user = this.UserService.findOne(username);
  //   return user;
  // }

  // @Patch(':username')
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
