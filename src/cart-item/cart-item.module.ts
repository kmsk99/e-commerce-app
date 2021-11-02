import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemRepository } from './cart-item.repository';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '@root/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItemRepository]),
    CartModule,
    ProductModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
