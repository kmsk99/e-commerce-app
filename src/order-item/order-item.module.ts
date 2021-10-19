import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-item.service';
import { OrderItemsController } from './order-item.controller';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
})
export class OrderItemsModule {}
