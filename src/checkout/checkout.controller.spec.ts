import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import * as faker from 'faker';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { PurchaseOneDto } from './dto/purchase-one.dto';

describe('CheckoutController', () => {
  let checkoutController: CheckoutController;
  let checkoutService: CheckoutService;

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

  const purchaseOneDto: PurchaseOneDto = {
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
      controllers: [CheckoutController],
      providers: [
        {
          provide: CheckoutService,
          useValue: { purchaseCart: jest.fn(), purchaseOne: jest.fn() },
        },
      ],
    }).compile();

    checkoutController = module.get<CheckoutController>(CheckoutController);
    checkoutService = module.get<CheckoutService>(CheckoutService);
  });

  it('should be defined', () => {
    expect(checkoutController).toBeDefined();
    expect(checkoutService).toBeDefined();
  });

  describe('/cart/checkout', () => {
    it('POST', async () => {
      const checkoutServicePurchaseCartSpy = jest
        .spyOn(checkoutService, 'purchaseCart')
        .mockResolvedValue(returnOrderItems);

      const result = await checkoutController.purchaseCart(request);

      expect(checkoutServicePurchaseCartSpy).toHaveBeenCalledWith(userId);
      expect(checkoutServicePurchaseCartSpy).toBeCalledTimes(1);
      expect(result).toBe(returnOrderItems);
    });
  });

  describe('/products/:id/checkout', () => {
    it('POST', async () => {
      const checkoutServicePurchaseOneSpy = jest
        .spyOn(checkoutService, 'purchaseOne')
        .mockResolvedValue(returnOrderItems);

      const result = await checkoutController.purchaseOne(
        request,
        String(productId),
        purchaseOneDto,
      );

      expect(checkoutServicePurchaseOneSpy).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
      expect(checkoutServicePurchaseOneSpy).toBeCalledTimes(1);
      expect(result).toBe(returnOrderItems);
    });
  });
});
