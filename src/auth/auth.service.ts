import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@root/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    try {
      const user = await this.userService.findOnePassword(username);
      if (user && (await argon2.verify(user.password, pass))) {
        const { password, ...result } = user;
        return result;
      } else {
        return null;
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
