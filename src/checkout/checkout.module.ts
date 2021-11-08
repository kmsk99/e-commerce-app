import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { OrderModule } from '../order/order.module';
import { OrderItemModule } from '@root/order-item/order-item.module';
import { CartItemModule } from '@root/cart-item/cart-item.module';
import { ProductModule } from '@root/product/product.module';
import { CheckoutController } from './checkout.controller';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '@root/cart/cart.module';

@Module({
  imports: [
    OrderModule,
    OrderItemModule,
    CartItemModule,
    ProductModule,
    PaymentModule,
    CartModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
