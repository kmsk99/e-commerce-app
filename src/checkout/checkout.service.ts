import { Injectable } from '@nestjs/common';
import { CartItemService } from '@root/cart-item/cart-item.service';
import { OrderItemService } from '@root/order-item/order-item.service';
import { OrderService } from '@root/order/order.service';
import { PaymentService } from '@root/payment/payment.service';
import { ProductService } from '@root/product/product.service';
import { UserService } from '@root/user/user.service';
import { AuthService } from '../auth/auth.service';
import { CartEmptyError } from './exceptions/cart-empty.exception';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
    private readonly authService: AuthService,
  ) {}

  async purchaseCart(userId: number, username: string, password: string) {
    await this.checkPassword(userId, username, password);

    const cartItems = await this.cartItemService.findAll(userId);

    const thisOrder = await this.orderService.create(userId, {
      total: cartItems.total,
    });

    if (cartItems.cartItems.length === 0) {
      throw new CartEmptyError();
    }

    for (const cartItem of cartItems.cartItems) {
      const orderItem = {
        orderId: thisOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      };

      await this.orderItemService.create(userId, orderItem);
    }

    const result = await this.orderItemService.findAll(userId, thisOrder.id);

    return result;
  }

  async purchaseOne(
    userId: number,
    username: string,
    productId: number,
    password: string,
    quantity: number,
  ) {
    await this.checkPassword(userId, username, password);

    const thisProduct = await this.productService.findOne(productId);

    const total = thisProduct.price * quantity;

    const thisOrder = await this.orderService.create(userId, { total: total });

    const orderItem = {
      orderId: thisOrder.id,
      productId: productId,
      quantity: quantity,
    };

    await this.orderItemService.create(userId, orderItem);

    const result = await this.orderItemService.findAll(userId, thisOrder.id);

    return result;
  }

  async checkPassword(userId: number, username: string, password: string) {
    await this.authService.validateUser(username, password);

    await this.paymentService.findOne(userId);
  }
}
