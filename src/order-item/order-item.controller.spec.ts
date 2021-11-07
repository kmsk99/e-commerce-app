import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import * as faker from 'faker';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from '../order/entities/order.entity';

describe('OrderItemController', () => {
  let orderItemController: OrderItemController;
  let orderItemService: OrderItemService;

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

  const request = { user: { id: userId, username: username } };

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

  const returnOrderItems = { orderItems: savedOrderItems, ...savedOrder };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        { provide: OrderItemService, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    orderItemController = module.get<OrderItemController>(OrderItemController);
    orderItemService = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(orderItemController).toBeDefined();
    expect(orderItemService).toBeDefined();
  });

  describe('/order/:orderId', () => {
    it('GET', async () => {
      const orderItemServiceFindAllSpy = jest
        .spyOn(orderItemService, 'findAll')
        .mockResolvedValue(returnOrderItems);

      const result = await orderItemController.findAll(
        request,
        String(orderId),
      );

      expect(orderItemServiceFindAllSpy).toHaveBeenCalledWith(userId, orderId);
      expect(orderItemServiceFindAllSpy).toBeCalledTimes(1);
      expect(result).toBe(returnOrderItems);
    });
  });
});
