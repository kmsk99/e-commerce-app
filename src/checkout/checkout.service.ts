import { Injectable } from '@nestjs/common';
import { CartItemService } from '@root/cart-item/cart-item.service';
import { ProductQuantityLackError } from '@root/cart-item/exceptions/product-quantity-lack.exception';
import { CartService } from '@root/cart/cart.service';
import { OrderItemService } from '@root/order-item/order-item.service';
import { OrderService } from '@root/order/order.service';
import { PaymentService } from '@root/payment/payment.service';
import { ProductService } from '@root/product/product.service';
import { CartEmptyError } from './exceptions/cart-empty.exception';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
  ) {}

  async purchaseCart(userId: number) {
    await this.paymentService.findOne(userId);

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

      await this.productService.sold(orderItem.productId, orderItem.quantity);
      await this.orderItemService.create(userId, orderItem);
    }

    await this.cartService.remove(cartItems.id);

    const result = await this.orderItemService.findAll(userId, thisOrder.id);

    return result;
  }

  async purchaseOne(userId: number, productId: number, quantity: number) {
    await this.paymentService.findOne(userId);

    const thisProduct = await this.productService.findOne(productId);

    if (thisProduct.quantity < quantity) {
      throw new ProductQuantityLackError();
    }

    const total = thisProduct.price * quantity;

    const thisOrder = await this.orderService.create(userId, { total: total });

    const orderItem = {
      orderId: thisOrder.id,
      productId: productId,
      quantity: quantity,
    };

    await this.productService.sold(orderItem.productId, orderItem.quantity);
    await this.orderItemService.create(userId, orderItem);

    const result = await this.orderItemService.findAll(userId, thisOrder.id);

    return result;
  }
}
