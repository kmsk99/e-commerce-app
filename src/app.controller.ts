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
import { loginDto } from './app.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpError4xxDto, userResponseDto, tokenResponseDto } from './app.dto';

@Controller()
@ApiTags('User Api')
@ApiBadRequestResponse({
  description: 'No required argument',
  type: HttpError4xxDto,
})
@ApiUnauthorizedResponse({
  description: 'Authentication failure',
  type: HttpError4xxDto,
})
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User Login Api', description: 'Login User' })
  @ApiBody({ description: 'Username, Password', type: loginDto })
  @ApiCreatedResponse({ description: 'Login User', type: tokenResponseDto })
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get User Information Api',
    description: 'Create User',
  })
  @ApiOkResponse({
    description: 'Get User Information',
    type: userResponseDto,
  })
  async getUser(@Request() req) {
    return await this.userService.findOne(req.user.username);
  }

  @Get('users/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get UserId Information Api',
    description: 'Create User',
  })
  @ApiOkResponse({
    description: 'Get User Information By UserId',
    type: userResponseDto,
  })
  async getUserId(@Param('userId') userId: number) {
    return await this.userService.findByUserId(userId);
  }
}
