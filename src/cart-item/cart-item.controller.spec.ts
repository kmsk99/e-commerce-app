import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import * as faker from 'faker';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartItemEntity } from './entities/cart-item.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

describe('CartItemController', () => {
  let cartItemController: CartItemController;
  let cartItemService: CartItemService;

  const cartItemId = faker.datatype.number();
  const cartId = faker.datatype.number();
  const userId = faker.datatype.number();
  const productId = faker.datatype.number();
  const quantity = faker.datatype.number();
  const updatedQuantity = faker.datatype.number();
  const username = faker.internet.userName();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const updatedUpdatedAt = faker.date.recent();
  const deletedAt = faker.date.recent();

  const request = { user: { id: userId, username: username } };

  const createCartItemDto: CreateCartItemDto = {
    productId: productId,
    quantity: quantity,
  };

  const updateCartItemDto: UpdateCartItemDto = {
    quantity: updatedQuantity,
  };

  const savedCartItem: CartItemEntity = {
    id: cartItemId,
    cartId: cartId,
    productId: productId,
    quantity: quantity,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: undefined,
  };

  const updatedCartItem: CartItemEntity = {
    id: cartItemId,
    cartId: cartId,
    productId: productId,
    quantity: updatedQuantity,
    createdAt: createdAt,
    updatedAt: updatedUpdatedAt,
    deletedAt: undefined,
  };

  const deletedCartItem: CartItemEntity = {
    id: cartItemId,
    cartId: cartId,
    productId: productId,
    quantity: updatedQuantity,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
  };

  const savedCartItems: CartItemEntity[] = [savedCartItem];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        {
          provide: CartItemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    cartItemController = module.get<CartItemController>(CartItemController);
    cartItemService = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(cartItemController).toBeDefined();
    expect(cartItemService).toBeDefined();
  });

  describe('/cart', () => {
    it('POST', async () => {
      const cartItemServiceCreateSpy = jest
        .spyOn(cartItemService, 'create')
        .mockResolvedValue(savedCartItem);

      const result = await cartItemController.create(
        request,
        createCartItemDto,
      );

      expect(cartItemServiceCreateSpy).toHaveBeenCalledWith(
        userId,
        createCartItemDto,
      );
      expect(cartItemServiceCreateSpy).toBeCalledTimes(1);
      expect(result).toBe(savedCartItem);
    });

    it('GET', async () => {
      const cartItemServiceFindAllSpy = jest
        .spyOn(cartItemService, 'findAll')
        .mockResolvedValue(savedCartItems);

      const result = await cartItemController.findAll(request);

      expect(cartItemServiceFindAllSpy).toHaveBeenCalledWith(userId);
      expect(cartItemServiceFindAllSpy).toBeCalledTimes(1);
      expect(result).toBe(savedCartItems);
    });

    describe('/:id', () => {
      it('GET', async () => {
        const cartItemServiceFindOneSpy = jest
          .spyOn(cartItemService, 'findOne')
          .mockResolvedValue(savedCartItem);

        const result = await cartItemController.findOne(String(cartItemId));

        expect(cartItemServiceFindOneSpy).toHaveBeenCalledWith(cartItemId);
        expect(cartItemServiceFindOneSpy).toBeCalledTimes(1);
        expect(result).toBe(savedCartItem);
      });

      it('PATCH', async () => {
        const cartItemServiceUpdateSpy = jest
          .spyOn(cartItemService, 'update')
          .mockResolvedValue(updatedCartItem);

        const result = await cartItemController.update(
          request,
          String(cartItemId),
          updateCartItemDto,
        );

        expect(cartItemServiceUpdateSpy).toHaveBeenCalledWith(
          userId,
          cartItemId,
          updateCartItemDto,
        );
        expect(cartItemServiceUpdateSpy).toBeCalledTimes(1);
        expect(result).toBe(updatedCartItem);
      });

      it('DELETE', async () => {
        const cartItemServiceRemoveSpy = jest
          .spyOn(cartItemService, 'remove')
          .mockResolvedValue(deletedCartItem);

        const result = await cartItemController.remove(String(cartItemId));

        expect(cartItemServiceRemoveSpy).toHaveBeenCalledWith(cartItemId);
        expect(cartItemServiceRemoveSpy).toBeCalledTimes(1);
        expect(result).toBe(deletedCartItem);
      });
    });
  });
});
