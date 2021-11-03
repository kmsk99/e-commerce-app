import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import * as faker from 'faker';
import { CartRepository } from './cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartEntity } from './entities/cart.entity';
import { UserNotFoundException } from '@root/user/exceptions/user-not-found.exception';
import { UserService } from '@root/user/user.service';
import { CartNotFoundError } from './exceptions/cart-not-found.exception';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateResult } from 'typeorm';

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: CartRepository;
  let userService: UserService;

  const cartId = faker.datatype.number();
  const userId = faker.datatype.number();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const updatedUpdatedAt = faker.date.recent();
  const deletedAt = faker.date.recent();
  const updatedTotal = faker.datatype.float();

  const createCartDto: CreateCartDto = {
    userId: userId,
  };

  const updateCartDto: UpdateCartDto = {
    total: updatedTotal,
  };

  const savedCart: CartEntity = {
    id: cartId,
    userId: userId,
    total: 0,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: undefined,
  };

  const deletedCart: CartEntity = {
    id: cartId,
    userId: userId,
    total: 0,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
  };

  const foundUserId = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    id: userId,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const updateCartResultSuccess: UpdateResult = {
    generatedMaps: [
      {
        id: cartId,
        createdAt: createdAt,
        updatedAt: updatedUpdatedAt,
      },
    ],
    raw: [
      {
        id: cartId,
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        CartRepository,
        {
          provide: UserService,
          useValue: { findByUserId: jest.fn() },
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<CartRepository>(CartRepository);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(cartService).toBeDefined();
    expect(cartRepository).toBeDefined();
  });

  describe('create', () => {
    it('success', async () => {
      const userServicefindByUserIdSpy = jest
        .spyOn(userService, 'findByUserId')
        .mockResolvedValue(foundUserId);

      const cartRepositorySaveSpy = jest
        .spyOn(cartRepository, 'save')
        .mockResolvedValue(savedCart);

      const result = await cartService.create(createCartDto);

      expect(userServicefindByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(userServicefindByUserIdSpy).toHaveBeenCalledTimes(1);
      expect(cartRepositorySaveSpy).toHaveBeenCalledWith(createCartDto);
      expect(cartRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCart);
    });

    it('user not found', async () => {
      const userServicefindByUserIdSpy = jest
        .spyOn(userService, 'findByUserId')
        .mockRejectedValue(new UserNotFoundException());

      try {
        await cartService.create(createCartDto);
      } catch (err) {
        expect(err).toBeInstanceOf(UserNotFoundException);
        expect(err.message).toBe('user not found');
        expect(err.status).toBe(400);
      }

      expect(userServicefindByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(userServicefindByUserIdSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('success', async () => {
      const findParam = {
        where: { id: cartId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(savedCart);

      const result = await cartService.findOne(cartId);

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCart);
    });

    it('cart not found', async () => {
      const findParam = {
        where: { id: cartId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await cartService.findOne(cartId);
      } catch (err) {
        expect(err).toBeInstanceOf(CartNotFoundError);
        expect(err.message).toBe('cart not found');
        expect(err.status).toBe(400);
      }

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByUserId', () => {
    it('success', async () => {
      const findParam = {
        where: { userId: userId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(savedCart);

      const result = await cartService.findOneByUserId(userId);

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCart);
    });

    it('cart not found and create one', async () => {
      const findParam = {
        where: { userId: userId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(null);

      const userServicefindByUserIdSpy = jest
        .spyOn(userService, 'findByUserId')
        .mockResolvedValue(foundUserId);

      const cartRepositorySaveSpy = jest
        .spyOn(cartRepository, 'save')
        .mockResolvedValue(savedCart);

      const result = await cartService.findOneByUserId(userId);

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(userServicefindByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(userServicefindByUserIdSpy).toHaveBeenCalledTimes(1);
      expect(cartRepositorySaveSpy).toHaveBeenCalledWith(createCartDto);
      expect(cartRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCart);
    });
  });

  describe('update', () => {
    it('success', async () => {
      const findParam = {
        where: { id: cartId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(savedCart);

      const cartRepositoryUpdateSpy = jest
        .spyOn(cartRepository, 'update')
        .mockResolvedValue(updateCartResultSuccess);

      const result = await cartService.update(cartId, updateCartDto);

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(cartRepositoryUpdateSpy).toHaveBeenCalledWith(
        cartId,
        updateCartDto,
      );
      expect(cartRepositoryUpdateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updateCartResultSuccess);
    });

    it('cart not found', async () => {
      const findParam = {
        where: { id: cartId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await cartService.update(cartId, updateCartDto);
      } catch (err) {
        expect(err).toBeInstanceOf(CartNotFoundError);
        expect(err.message).toBe('cart not found');
        expect(err.status).toBe(400);
      }

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('success', async () => {
      const findParam = {
        where: { id: cartId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(savedCart);

      const cartRepositorySoftDeleteSpy = jest
        .spyOn(cartRepository, 'softRemove')
        .mockResolvedValue(deletedCart);

      const result = await cartService.remove(cartId);

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(cartRepositorySoftDeleteSpy).toHaveBeenCalledWith(savedCart);
      expect(cartRepositorySoftDeleteSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(deletedCart);
    });

    it('cart not found', async () => {
      const findParam = {
        where: { id: cartId },
      };

      const cartRepositoryFindOneSpy = jest
        .spyOn(cartRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await cartService.remove(cartId);
      } catch (err) {
        expect(err).toBeInstanceOf(CartNotFoundError);
        expect(err.message).toBe('cart not found');
        expect(err.status).toBe(400);
      }

      expect(cartRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(cartRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });
});
