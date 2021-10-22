import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@root/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    try {
      if (user && (await argon2.verify(user.password, pass))) {
        const { password, ...result } = user;
        return result;
      } else {
        return null;
      }
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
