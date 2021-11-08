import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { HttpError4xxDto } from '../app.dto';

@Controller()
@ApiTags('User Api')
@Controller('post')
@ApiBadRequestResponse({
  description: 'No required argument',
  type: HttpError4xxDto,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'User Register Api', description: 'Create User' })
  @ApiCreatedResponse({ description: 'Create User', type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
