import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@root/user/user.module';
import { AuthService } from '@root/auth/auth.service';
import { jwtConstants } from '@root/auth/constants';
import { JwtStrategy } from '@root/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@root/auth/strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
