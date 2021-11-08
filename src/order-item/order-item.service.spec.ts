import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import * as faker from 'faker';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderService } from '@root/order/order.service';
import { OrderItemRepository } from './order-item.repository';
import { OrderEntity } from '../order/entities/order.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderNotFoundError } from '@root/order/exceptions/order-not-found.exception';
import { UnauthorizedException } from '@nestjs/common';
import { ProductNotFoundError } from '@root/product/exceptions/product-not-found.exception';
import { ProductQuantityLackError } from '@root/cart-item/exceptions/product-quantity-lack.exception';
import { OrderItemNotFoundError } from './exceptions/order-item-not-found.exception';
import { ProductService } from '@root/product/product.service';

describe('OrderItemService', () => {
  let orderItemService: OrderItemService;
  let orderItemRepository: OrderItemRepository;
  let orderService: OrderService;
  let productService: ProductService;

  const orderItemId = faker.datatype.number();
  const orderId = faker.datatype.number();
  const productId = faker.datatype.number();
  const userId = faker.datatype.number();
  const paymentId = faker.datatype.number();
  const total = +faker.commerce.price();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const randomProductName = faker.commerce.productName();
  const randomProductPrice = +faker.commerce.price();
  const categoryId = faker.datatype.number();
  const quantity = 20;

  const createOrderItemDto: CreateOrderItemDto = {
    orderId: orderId,
    productId: productId,
    quantity: quantity,
  };

  const savedOrderItem: OrderItemEntity = {
    id: orderItemId,
    orderId: orderId,
    productId: productId,
    quantity: quantity,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

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

  const savedOrder: OrderEntity = {
    id: orderId,
    userId: userId,
    paymentId: paymentId,
    total: total,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  const savedOrderItems: OrderItemEntity[] = [savedOrderItem];

  const returnOrderItems = { orderItems: savedOrderItems, ...savedOrder };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        OrderItemRepository,
        { provide: OrderService, useValue: { findOne: jest.fn() } },
        {
          provide: ProductService,
          useValue: { sold: jest.fn() },
        },
      ],
    }).compile();

    orderItemService = module.get<OrderItemService>(OrderItemService);
    orderItemRepository = module.get<OrderItemRepository>(OrderItemRepository);
    orderService = module.get<OrderService>(OrderService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(orderItemService).toBeDefined();
    expect(orderItemRepository).toBeDefined();
    expect(orderService).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('create', () => {
    it('success', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockResolvedValue(savedOrder);

      const productServiceCheckProductQuantitySpy = jest
        .spyOn(productService, 'sold')
        .mockResolvedValue(foundProduct);

      const orderItemRepositorySaveSpy = jest
        .spyOn(orderItemRepository, 'save')
        .mockResolvedValue(savedOrderItem);

      const result = await orderItemService.create(userId, createOrderItemDto);

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
      expect(productServiceCheckProductQuantitySpy).toBeCalledWith(
        productId,
        quantity,
      );
      expect(productServiceCheckProductQuantitySpy).toBeCalledTimes(1);
      expect(orderItemRepositorySaveSpy).toBeCalledWith(createOrderItemDto);
      expect(orderItemRepositorySaveSpy).toBeCalledTimes(1);
      expect(result).toBe(savedOrderItem);
    });

    it('order not found', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockRejectedValue(new OrderNotFoundError());

      try {
        await orderItemService.create(userId, createOrderItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(OrderNotFoundError);
        expect(err.message).toBe('order not found');
        expect(err.status).toBe(400);
      }

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
    });

    it('Unauthorized', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await orderItemService.create(userId, createOrderItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toBe('Unauthorized');
        expect(err.status).toBe(401);
      }

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
    });

    it('product not found', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockResolvedValue(savedOrder);

      const productServiceCheckProductQuantitySpy = jest
        .spyOn(productService, 'sold')
        .mockRejectedValue(new ProductNotFoundError());

      try {
        await orderItemService.create(userId, createOrderItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
      expect(productServiceCheckProductQuantitySpy).toBeCalledWith(
        productId,
        quantity,
      );
      expect(productServiceCheckProductQuantitySpy).toBeCalledTimes(1);
    });

    it('product quantity lack', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockResolvedValue(savedOrder);

      const productServiceCheckProductQuantitySpy = jest
        .spyOn(productService, 'sold')
        .mockRejectedValue(new ProductQuantityLackError());

      try {
        await orderItemService.create(userId, createOrderItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductQuantityLackError);
        expect(err.message).toBe('product quantity lack');
        expect(err.status).toBe(400);
      }

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
      expect(productServiceCheckProductQuantitySpy).toBeCalledWith(
        productId,
        quantity,
      );
      expect(productServiceCheckProductQuantitySpy).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('success', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockResolvedValue(savedOrder);

      const orderItemRepositoryFindSpy = jest
        .spyOn(orderItemRepository, 'find')
        .mockResolvedValue(savedOrderItems);

      const result = await orderItemService.findAll(userId, orderId);

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
      expect(orderItemRepositoryFindSpy).toBeCalledWith({
        where: { orderId: orderId },
      });
      expect(orderItemRepositoryFindSpy).toBeCalledTimes(1);
      expect(result).toStrictEqual(returnOrderItems);
    });

    it('order not found', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockRejectedValue(new OrderNotFoundError());

      try {
        await orderItemService.findAll(userId, orderId);
      } catch (err) {
        expect(err).toBeInstanceOf(OrderNotFoundError);
        expect(err.message).toBe('order not found');
        expect(err.status).toBe(400);
      }

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
    });

    it('Unauthorized', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await orderItemService.findAll(userId, orderId);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toBe('Unauthorized');
        expect(err.status).toBe(401);
      }

      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('success', async () => {
      const orderItemRepositoryFindSpy = jest
        .spyOn(orderItemRepository, 'findOne')
        .mockResolvedValue(savedOrderItem);

      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockResolvedValue(savedOrder);

      const result = await orderItemService.findOne(userId, orderItemId);

      expect(orderItemRepositoryFindSpy).toBeCalledWith({
        where: { id: orderItemId },
      });
      expect(orderItemRepositoryFindSpy).toBeCalledTimes(1);
      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
      expect(result).toStrictEqual(savedOrderItem);
    });

    it('order item not found', async () => {
      const orderItemRepositoryFindSpy = jest
        .spyOn(orderItemRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await orderItemService.findOne(userId, orderItemId);
      } catch (err) {
        expect(err).toBeInstanceOf(OrderItemNotFoundError);
        expect(err.message).toBe('order item not found');
        expect(err.status).toBe(400);
      }

      expect(orderItemRepositoryFindSpy).toBeCalledWith({
        where: { id: orderItemId },
      });
      expect(orderItemRepositoryFindSpy).toBeCalledTimes(1);
    });

    it('order not found', async () => {
      const orderItemRepositoryFindSpy = jest
        .spyOn(orderItemRepository, 'findOne')
        .mockResolvedValue(savedOrderItem);

      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockRejectedValue(new OrderNotFoundError());

      try {
        await orderItemService.findOne(userId, orderItemId);
      } catch (err) {
        expect(err).toBeInstanceOf(OrderNotFoundError);
        expect(err.message).toBe('order not found');
        expect(err.status).toBe(400);
      }

      expect(orderItemRepositoryFindSpy).toBeCalledWith({
        where: { id: orderItemId },
      });
      expect(orderItemRepositoryFindSpy).toBeCalledTimes(1);
      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
    });

    it('Unauthorized', async () => {
      const orderItemRepositoryFindSpy = jest
        .spyOn(orderItemRepository, 'findOne')
        .mockResolvedValue(savedOrderItem);

      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await orderItemService.findOne(userId, orderItemId);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toBe('Unauthorized');
        expect(err.status).toBe(401);
      }

      expect(orderItemRepositoryFindSpy).toBeCalledWith({
        where: { id: orderItemId },
      });
      expect(orderItemRepositoryFindSpy).toBeCalledTimes(1);
      expect(orderServiceFindOneSpy).toBeCalledWith(userId, orderId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
    });
  });
});
