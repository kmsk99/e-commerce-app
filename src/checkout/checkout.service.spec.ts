import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from './checkout.service';
import { OrderService } from '../order/order.service';
import { OrderItemService } from '../order-item/order-item.service';
import { CartItemService } from '../cart-item/cart-item.service';
import { ProductService } from '../product/product.service';
import { PaymentService } from '../payment/payment.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import * as faker from 'faker';
import { OrderItemEntity } from '@root/order-item/entities/order-item.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { UnauthorizedException } from '@nestjs/common';
import { PaymentNotFoundError } from '@root/payment/exceptions/pament-not-found.exception';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartItemEntity } from '../cart-item/entities/cart-item.entity';
import { CartEmptyError } from './exceptions/cart-empty.exception';
import { ProductEntity } from '@root/product/entities/product.entity';
import { ProductNotFoundError } from '../product/exceptions/product-not-found.exception';
import { ProductQuantityLackError } from '../cart-item/exceptions/product-quantity-lack.exception';

describe('CheckoutService', () => {
  let checkoutService: CheckoutService;
  let orderService: OrderService;
  let orderItemService: OrderItemService;
  let cartItemService: CartItemService;
  let productService: ProductService;
  let paymentService: PaymentService;
  let authService: AuthService;

  const cartItemId = faker.datatype.number();
  const cartId = faker.datatype.number();
  const orderItemId = faker.datatype.number();
  const orderId = faker.datatype.number();
  const productId = faker.datatype.number();
  const userId = faker.datatype.number();
  const quantity = faker.datatype.number();
  const username = faker.internet.userName();
  const paymentId = faker.datatype.number();
  const total = +faker.commerce.price();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const password = faker.internet.password();
  const randomProductName = faker.commerce.productName();
  const randomProductPrice = +faker.commerce.price();
  const categoryId = faker.datatype.number();

  const foundProduct: ProductEntity = {
    id: productId,
    name: randomProductName,
    categoryId: categoryId,
    quantity: quantity,
    price: randomProductPrice,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
  };

  const savedOrderItem: OrderItemEntity = {
    id: orderItemId,
    orderId: orderId,
    productId: productId,
    quantity: quantity,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  const savedOrder: OrderEntity = {
    id: orderId,
    userId: userId,
    paymentId: paymentId,
    total: total,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  const savedOrderItems: OrderItemEntity[] = [savedOrderItem];

  const savedCartItem: CartItemEntity = {
    id: cartItemId,
    cartId: cartId,
    productId: productId,
    quantity: quantity,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: undefined,
  };

  const savedCartItems: CartItemEntity[] = [savedCartItem];

  const foundCart: CartEntity = {
    id: cartId,
    userId: userId,
    total: total,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: undefined,
  };

  const returnOrderItems = { orderItems: savedOrderItems, ...savedOrder };

  const cartAndCartItems = {
    cartItems: savedCartItems,
    ...foundCart,
  };

  const emptyCart = { cartItems: [], ...foundCart };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        { provide: OrderService, useValue: { create: jest.fn() } },
        {
          provide: OrderItemService,
          useValue: { create: jest.fn(), findAll: jest.fn() },
        },
        { provide: CartItemService, useValue: { findAll: jest.fn() } },
        {
          provide: ProductService,
          useValue: { findOne: jest.fn(), sold: jest.fn() },
        },
        { provide: PaymentService, useValue: { findOne: jest.fn() } },
        { provide: AuthService, useValue: { validateUser: jest.fn() } },
      ],
    }).compile();

    checkoutService = module.get<CheckoutService>(CheckoutService);
    orderService = module.get<OrderService>(OrderService);
    orderItemService = module.get<OrderItemService>(OrderItemService);
    cartItemService = module.get<CartItemService>(CartItemService);
    productService = module.get<ProductService>(ProductService);
    paymentService = module.get<PaymentService>(PaymentService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(checkoutService).toBeDefined();
    expect(orderService).toBeDefined();
    expect(orderItemService).toBeDefined();
    expect(cartItemService).toBeDefined();
    expect(productService).toBeDefined();
    expect(paymentService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('purchaseCart', () => {
    it('success', async () => {
      const authServiceValidateUserSpy = jest.spyOn(
        authService,
        'validateUser',
      );

      const paymentServiceFindOne = jest.spyOn(paymentService, 'findOne');

      const cartItemServiceFindAllSpy = jest
        .spyOn(cartItemService, 'findAll')
        .mockResolvedValue(cartAndCartItems);

      const orderServiceCreateSpy = jest
        .spyOn(orderService, 'create')
        .mockResolvedValue(savedOrder);

      const orderItemServiceCreateSpy = jest
        .spyOn(orderItemService, 'create')
        .mockResolvedValue(savedOrderItem);

      const orderItemServiceFindAllSpy = jest
        .spyOn(orderItemService, 'findAll')
        .mockResolvedValue(returnOrderItems);

      const result = await checkoutService.purchaseCart(
        userId,
        username,
        password,
      );

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOne).toBeCalledWith(userId);
      expect(paymentServiceFindOne).toBeCalledTimes(1);
      expect(cartItemServiceFindAllSpy).toBeCalledWith(userId);
      expect(cartItemServiceFindAllSpy).toBeCalledTimes(1);
      expect(orderServiceCreateSpy).toBeCalledWith(userId, { total: total });
      expect(orderServiceCreateSpy).toBeCalledTimes(1);
      expect(orderItemServiceCreateSpy).toBeCalledWith(userId, {
        orderId: orderId,
        productId: productId,
        quantity: quantity,
      });
      expect(orderItemServiceCreateSpy).toBeCalledTimes(1);
      expect(orderItemServiceFindAllSpy).toBeCalledWith(userId, orderId);
      expect(orderItemServiceFindAllSpy).toBeCalledTimes(1);
      expect(result).toBe(returnOrderItems);
    });

    it('cart empty', async () => {
      const authServiceValidateUserSpy = jest.spyOn(
        authService,
        'validateUser',
      );

      const paymentServiceFindOne = jest.spyOn(paymentService, 'findOne');

      const cartItemServiceFindAllSpy = jest
        .spyOn(cartItemService, 'findAll')
        .mockResolvedValue(emptyCart);

      try {
        await checkoutService.purchaseCart(userId, username, password);
      } catch (err) {
        expect(err).toBeInstanceOf(CartEmptyError);
        expect(err.message).toBe('cart empty');
        expect(err.status).toBe(400);
      }

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOne).toBeCalledWith(userId);
      expect(paymentServiceFindOne).toBeCalledTimes(1);
      expect(cartItemServiceFindAllSpy).toBeCalledWith(userId);
      expect(cartItemServiceFindAllSpy).toBeCalledTimes(1);
    });
  });

  describe('purchaseOne', () => {
    it('success', async () => {
      const authServiceValidateUserSpy = jest.spyOn(
        authService,
        'validateUser',
      );

      const paymentServiceFindOne = jest.spyOn(paymentService, 'findOne');

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundProduct);

      const orderServiceCreateSpy = jest
        .spyOn(orderService, 'create')
        .mockResolvedValue(savedOrder);

      const orderItemServiceCreateSpy = jest
        .spyOn(orderItemService, 'create')
        .mockResolvedValue(savedOrderItem);

      const orderItemServiceFindAllSpy = jest
        .spyOn(orderItemService, 'findAll')
        .mockResolvedValue(returnOrderItems);

      const result = await checkoutService.purchaseOne(
        userId,
        username,
        productId,
        password,
        quantity,
      );

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOne).toBeCalledWith(userId);
      expect(paymentServiceFindOne).toBeCalledTimes(1);
      expect(productServiceFindOneSpy).toBeCalledWith(productId);
      expect(productServiceFindOneSpy).toBeCalledTimes(1);
      expect(orderServiceCreateSpy).toBeCalledWith(userId, {
        total: quantity * randomProductPrice,
      });
      expect(orderServiceCreateSpy).toBeCalledTimes(1);
      expect(orderItemServiceCreateSpy).toBeCalledWith(userId, {
        orderId: orderId,
        productId: productId,
        quantity: quantity,
      });
      expect(orderItemServiceCreateSpy).toBeCalledTimes(1);
      expect(orderItemServiceFindAllSpy).toBeCalledWith(userId, orderId);
      expect(orderItemServiceFindAllSpy).toBeCalledTimes(1);
      expect(result).toBe(returnOrderItems);
    });

    it('product not found', async () => {
      const authServiceValidateUserSpy = jest.spyOn(
        authService,
        'validateUser',
      );

      const paymentServiceFindOne = jest.spyOn(paymentService, 'findOne');

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockRejectedValue(new ProductNotFoundError());

      try {
        await checkoutService.purchaseOne(
          userId,
          username,
          productId,
          password,
          quantity,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOne).toBeCalledWith(userId);
      expect(paymentServiceFindOne).toBeCalledTimes(1);
      expect(productServiceFindOneSpy).toBeCalledWith(productId);
      expect(productServiceFindOneSpy).toBeCalledTimes(1);
    });

    it('product quantity lack', async () => {
      const authServiceValidateUserSpy = jest.spyOn(
        authService,
        'validateUser',
      );

      const paymentServiceFindOne = jest.spyOn(paymentService, 'findOne');

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundProduct);

      try {
        await checkoutService.purchaseOne(
          userId,
          username,
          productId,
          password,
          quantity + 5,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(ProductQuantityLackError);
        expect(err.message).toBe('product quantity lack');
        expect(err.status).toBe(400);
      }

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOne).toBeCalledWith(userId);
      expect(paymentServiceFindOne).toBeCalledTimes(1);
      expect(productServiceFindOneSpy).toBeCalledWith(productId);
      expect(productServiceFindOneSpy).toBeCalledTimes(1);
    });
  });

  describe('checkPassword', () => {
    it('success', async () => {
      const authServiceValidateUserSpy = jest.spyOn(
        authService,
        'validateUser',
      );

      const paymentServiceFindOne = jest.spyOn(paymentService, 'findOne');

      await checkoutService.checkPassword(userId, username, password);

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOne).toBeCalledWith(userId);
      expect(paymentServiceFindOne).toBeCalledTimes(1);
    });

    it('Unauthorized', async () => {
      const authServiceValidateUserSpy = jest
        .spyOn(authService, 'validateUser')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await checkoutService.checkPassword(userId, username, password);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toBe('Unauthorized');
        expect(err.status).toBe(401);
      }

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
    });

    it('payment not found', async () => {
      const authServiceValidateUserSpy = jest.spyOn(
        authService,
        'validateUser',
      );

      const paymentServiceFindOne = jest
        .spyOn(paymentService, 'findOne')
        .mockRejectedValue(new PaymentNotFoundError());

      try {
        await checkoutService.checkPassword(userId, username, password);
      } catch (err) {
        expect(err).toBeInstanceOf(PaymentNotFoundError);
        expect(err.message).toBe('payment not found');
        expect(err.status).toBe(400);
      }

      expect(authServiceValidateUserSpy).toBeCalledWith(username, password);
      expect(authServiceValidateUserSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOne).toBeCalledWith(userId);
      expect(paymentServiceFindOne).toBeCalledTimes(1);
    });
  });
});
