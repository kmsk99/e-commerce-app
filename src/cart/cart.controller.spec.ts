import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import * as faker from 'faker';
import { CartEntity } from './entities/cart.entity';

describe('CartController', () => {
  let cartController: CartController;
  let cartService: CartService;

  const cartId = faker.datatype.number();
  const userId = faker.datatype.number();
  const username = faker.internet.userName();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();

  const request = { user: { id: userId, username: username } };

  const savedCart: CartEntity = {
    id: cartId,
    userId: userId,
    total: 0,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            findOneByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(cartService).toBeDefined();
    expect(cartController).toBeDefined();
  });

  describe('cart', () => {
    it('GET', async () => {
      const cartServiceFindOneSpy = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockResolvedValue(savedCart);

      const result = await cartController.findOne(request);

      expect(cartServiceFindOneSpy).toHaveBeenCalledWith(userId);
      expect(cartServiceFindOneSpy).toBeCalledTimes(1);
      expect(result).toBe(savedCart);
    });

    it.skip('POST', async () => {
      // const cartServiceCreateSpy = jest
      //   .spyOn(cartService, 'create')
      //   .mockResolvedValue(savedCart);
      // const result = await cartController.create(createCartDto);
      // expect(cartServiceCreateSpy).toHaveBeenCalledWith(createCartDto);
      // expect(cartServiceCreateSpy).toBeCalledTimes(1);
      // expect(result).toBe(savedCart);
    });

    it.skip('DELETE', async () => {
      // const cartServiceRemoveSpy = jest
      //   .spyOn(cartService, 'remove')
      //   .mockResolvedValue(deletedCart);
      // const result = await cartController.remove(String(userId));
      // expect(cartServiceRemoveSpy).toHaveBeenCalledWith(userId);
      // expect(cartServiceRemoveSpy).toBeCalledTimes(1);
      // expect(result).toBe(deletedCart);
    });
  });
});
