import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItemRepository } from './order-item.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '@root/order/order.module';
import { ProductModule } from '@root/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemRepository]),
    OrderModule,
    ProductModule,
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
