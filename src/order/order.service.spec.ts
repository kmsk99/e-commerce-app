import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '@root/payment/payment.service';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service';
import * as faker from 'faker';
import { OrderEntity } from './entities/order.entity';
import { PaymentEntity } from '@root/payment/entities/payment.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserNotFoundException } from '@root/user/exceptions/user-not-found.exception';
import { PaymentNotFoundError } from '@root/payment/exceptions/pament-not-found.exception';
import { OrderNotFoundError } from './exceptions/order-not-found.exception';
import { UnauthorizedException } from '@nestjs/common';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;
  let userService: UserService;
  let paymentService: PaymentService;

  const orderId = faker.datatype.number();
  const userId = faker.datatype.number();
  const otherUserId = faker.datatype.number();
  const paymentId = faker.datatype.number();
  const total = +faker.commerce.price();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();

  const createOrderDto: CreateOrderDto = {
    total: total,
  };

  const savedOrder: OrderEntity = {
    id: orderId,
    userId: userId,
    paymentId: paymentId,
    total: total,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  const savedUser = {
    id: userId,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  const savedPayment: PaymentEntity = {
    id: paymentId,
    userId: userId,
    status: true,
    provider: faker.finance.creditCardNumber(),
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
  };

  const savedOrders: OrderEntity[] = [savedOrder];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        OrderRepository,
        { provide: UserService, useValue: { findByUserId: jest.fn() } },
        { provide: PaymentService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    userService = module.get<UserService>(UserService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(userService).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  describe('create', () => {
    it('success', async () => {
      const userServiceFindByUserIdSpy = jest
        .spyOn(userService, 'findByUserId')
        .mockResolvedValue(savedUser);

      const paymentServiceFindOneSpy = jest
        .spyOn(paymentService, 'findOne')
        .mockResolvedValue(savedPayment);

      const orderRepositorySaveSpy = jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValue(savedOrder);

      const result = await orderService.create(userId, createOrderDto);

      expect(userServiceFindByUserIdSpy).toBeCalledWith(userId);
      expect(userServiceFindByUserIdSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOneSpy).toBeCalledWith(userId);
      expect(paymentServiceFindOneSpy).toBeCalledTimes(1);
      expect(orderRepositorySaveSpy).toBeCalledWith({
        userId: userId,
        paymentId: paymentId,
        total: total,
      });
      expect(orderRepositorySaveSpy).toBeCalledTimes(1);
      expect(result).toBe(savedOrder);
    });

    it('user not found', async () => {
      const userServiceFindByUserIdSpy = jest
        .spyOn(userService, 'findByUserId')
        .mockRejectedValue(new UserNotFoundException());

      try {
        await orderService.create(userId, createOrderDto);
      } catch (err) {
        expect(err).toBeInstanceOf(UserNotFoundException);
        expect(err.message).toBe('user not found');
        expect(err.status).toBe(400);
      }

      expect(userServiceFindByUserIdSpy).toBeCalledWith(userId);
      expect(userServiceFindByUserIdSpy).toBeCalledTimes(1);
    });

    it('payment not found', async () => {
      const userServiceFindByUserIdSpy = jest
        .spyOn(userService, 'findByUserId')
        .mockResolvedValue(savedUser);

      const paymentServiceFindOneSpy = jest
        .spyOn(paymentService, 'findOne')
        .mockRejectedValue(new PaymentNotFoundError());

      try {
        await orderService.create(userId, createOrderDto);
      } catch (err) {
        expect(err).toBeInstanceOf(PaymentNotFoundError);
        expect(err.message).toBe('payment not found');
        expect(err.status).toBe(400);
      }

      expect(userServiceFindByUserIdSpy).toBeCalledWith(userId);
      expect(userServiceFindByUserIdSpy).toBeCalledTimes(1);
      expect(paymentServiceFindOneSpy).toBeCalledWith(userId);
      expect(paymentServiceFindOneSpy).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('success', async () => {
      const orderRepositoryFindSpy = jest
        .spyOn(orderRepository, 'find')
        .mockResolvedValue(savedOrders);

      const result = await orderService.findAll(userId);

      expect(orderRepositoryFindSpy).toBeCalledWith({
        where: { userId: userId },
      });
      expect(orderRepositoryFindSpy).toBeCalledTimes(1);
      expect(result).toBe(savedOrders);
    });
  });

  describe('findOne', () => {
    it('success', async () => {
      const orderRepositoryFindOneSpy = jest
        .spyOn(orderRepository, 'findOne')
        .mockResolvedValue(savedOrder);

      const result = await orderService.findOne(userId, orderId);

      expect(orderRepositoryFindOneSpy).toBeCalledWith({
        where: { id: orderId },
      });
      expect(orderRepositoryFindOneSpy).toBeCalledTimes(1);
      expect(result).toBe(savedOrder);
    });

    it('order not found', async () => {
      const orderRepositoryFindOneSpy = jest
        .spyOn(orderRepository, 'findOne')
        .mockRejectedValue(new OrderNotFoundError());

      try {
        await orderService.findOne(userId, orderId);
      } catch (err) {
        expect(err).toBeInstanceOf(OrderNotFoundError);
        expect(err.message).toBe('order not found');
        expect(err.status).toBe(400);
      }

      expect(orderRepositoryFindOneSpy).toBeCalledWith({
        where: { id: orderId },
      });
      expect(orderRepositoryFindOneSpy).toBeCalledTimes(1);
    });

    it('unauthorized', async () => {
      const orderRepositoryFindOneSpy = jest
        .spyOn(orderRepository, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await orderService.findOne(otherUserId, orderId);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toBe('Unauthorized');
        expect(err.status).toBe(401);
      }

      expect(orderRepositoryFindOneSpy).toBeCalledWith({
        where: { id: orderId },
      });
      expect(orderRepositoryFindOneSpy).toBeCalledTimes(1);
    });
  });
});
