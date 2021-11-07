import { Test, TestingModule } from '@nestjs/testing';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import * as faker from 'faker';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  const orderId = faker.datatype.number();
  const userId = faker.datatype.number();
  const paymentId = faker.datatype.number();
  const username = faker.internet.userName();
  const total = +faker.commerce.price();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();

  const request = { user: { id: userId, username: username } };

  const savedOrder: OrderEntity = {
    id: orderId,
    userId: userId,
    paymentId: paymentId,
    total: total,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  const savedOrders: OrderEntity[] = [savedOrder];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: { findAll: jest.fn() } }],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
    expect(orderService).toBeDefined();
  });

  describe('/order', () => {
    it('GET', async () => {
      const orderServiceFindOneSpy = jest
        .spyOn(orderService, 'findAll')
        .mockResolvedValue(savedOrders);

      const result = await orderController.findAll(request);

      expect(orderServiceFindOneSpy).toHaveBeenCalledWith(userId);
      expect(orderServiceFindOneSpy).toBeCalledTimes(1);
      expect(result).toBe(savedOrders);
    });
  });
});
