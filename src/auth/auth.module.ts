import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@root/users/users.module';
import { AuthService } from '@root/auth/auth.service';
import { jwtConstants } from '@root/auth/constants';
import { JwtStrategy } from '@root/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@root/auth/strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
