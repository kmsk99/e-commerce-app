import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartRepository]), UserModule],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
