import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsController } from './order-item.controller';
import { OrderItemsService } from './order-item.service';

describe('OrderItemsController', () => {
  let controller: OrderItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [OrderItemsService],
    }).compile();

    controller = module.get<OrderItemsController>(OrderItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
