import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { LocalAuthGuard } from '@root/auth/guards/local-auth.guard';
import { AuthService } from '@root/auth/auth.service';
import { JwtAuthGuard } from '@root/auth/guards/jwt-auth.guard';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers(@Request() req) {
    return this.userService.findOne(req.user.username);
  }

  @Get('users/:userId')
  getUserId(@Param('userId') userId: number) {
    return this.userService.findByUserId(userId);
  }
}
