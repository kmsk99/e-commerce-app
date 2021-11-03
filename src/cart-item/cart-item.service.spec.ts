import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '@root/cart/cart.service';
import { ProductService } from '@root/product/product.service';
import { CartItemRepository } from './cart-item.repository';
import { CartItemService } from './cart-item.service';
import * as faker from 'faker';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartEntity } from '@root/cart/entities/cart.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { UpdateResult } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartNotFoundError } from '@root/cart/exceptions/cart-not-found.exception';
import { ProductAlreadyExistsInCartError } from './exceptions/product-already-exists-in-cart.exception';
import { ProductNotFoundError } from '../product/exceptions/product-not-found.exception';
import { ProductQuantityLackError } from './exceptions/product-quantity-lack.exception';
import { CartItemNotFoundError } from './exceptions/cart-item-not-found.exception';

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let cartItemRepository: CartItemRepository;
  let cartService: CartService;
  let productService: ProductService;

  const userId = faker.datatype.number();
  const cartItemId = faker.datatype.number();
  const productId = faker.datatype.number();
  const cartId = faker.datatype.number();
  const randomProductName = faker.commerce.productName();
  const randomProductPrice = +faker.commerce.price();
  const categoryId = faker.datatype.number();
  const cartItemQuantity = 20;
  const updatedQuantity = 25;
  const productQuantityEnough = 30;
  const productQuantityLack = 10;
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const updatedUpdatedAt = faker.date.recent();
  const deletedAt = faker.date.recent();
  const updatedTotal = randomProductPrice * cartItemQuantity;

  const createCartItemDto: CreateCartItemDto = {
    productId: productId,
    quantity: cartItemQuantity,
  };

  const updateCartItemDto: UpdateCartItemDto = {
    quantity: updatedQuantity,
  };

  const savedCartItem: CartItemEntity = {
    id: cartItemId,
    cartId: cartId,
    productId: productId,
    quantity: cartItemQuantity,
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
    quantity: cartItemQuantity,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
  };

  const savedCartItems: CartItemEntity[] = [savedCartItem];

  const foundCart: CartEntity = {
    id: cartId,
    userId: userId,
    total: 0,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: undefined,
  };

  const foundEnoughProduct: ProductEntity = {
    id: productId,
    name: randomProductName,
    categoryId: categoryId,
    quantity: productQuantityEnough,
    price: randomProductPrice,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
  };

  const foundLackProduct: ProductEntity = {
    id: productId,
    name: randomProductName,
    categoryId: categoryId,
    quantity: productQuantityLack,
    price: randomProductPrice,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
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

  const cartAndCartItems = {
    cartItems: savedCartItems,
    ...foundCart,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        CartItemRepository,
        {
          provide: CartService,
          useValue: { findOneByUserId: jest.fn(), update: jest.fn() },
        },
        {
          provide: ProductService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    cartItemService = module.get<CartItemService>(CartItemService);
    cartItemRepository = module.get<CartItemRepository>(CartItemRepository);
    cartService = module.get<CartService>(CartService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(cartItemService).toBeDefined();
    expect(cartItemRepository).toBeDefined();
    expect(cartService).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('create', () => {
    it('success', async () => {
      const cartServicefindOneByUserIdSpy = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockResolvedValue(foundCart);

      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(undefined);

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundEnoughProduct);

      const cartItemRepositorySaveSpy = jest
        .spyOn(cartItemRepository, 'save')
        .mockResolvedValue(savedCartItem);

      const cartItemRepositoryFindSpy = jest
        .spyOn(cartItemRepository, 'find')
        .mockResolvedValue(savedCartItems);

      const cartServiceUpdateSpy = jest
        .spyOn(cartService, 'update')
        .mockResolvedValue(updateCartResultSuccess);

      const result = await cartItemService.create(userId, createCartItemDto);

      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledTimes(1);
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { productId: productId, cartId: cartId },
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(2);
      expect(cartItemRepositorySaveSpy).toHaveBeenCalledWith({
        cartId: cartId,
        ...createCartItemDto,
      });
      expect(cartItemRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledWith({
        cartId: cartId,
      });
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(cartServiceUpdateSpy).toHaveBeenCalledWith(cartId, {
        total: updatedTotal,
      });
      expect(cartServiceUpdateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCartItem);
    });

    it('cart not found', async () => {
      const cartServicefindOneByUserIdSpy = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockRejectedValue(new CartNotFoundError());

      try {
        await cartItemService.create(userId, createCartItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(CartNotFoundError);
        expect(err.message).toBe('cart not found');
        expect(err.status).toBe(400);
      }

      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledTimes(1);
    });

    it('product already exists in cart', async () => {
      const cartServicefindOneByUserIdSpy = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockResolvedValue(foundCart);

      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(savedCartItem);

      try {
        await cartItemService.create(userId, createCartItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductAlreadyExistsInCartError);
        expect(err.message).toBe('product already exists in cart');
        expect(err.status).toBe(400);
      }

      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledTimes(1);
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { productId: productId, cartId: cartId },
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });

    it('product not found', async () => {
      const cartServicefindOneByUserIdSpy = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockResolvedValue(foundCart);

      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(undefined);

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockRejectedValue(new ProductNotFoundError());

      try {
        await cartItemService.create(userId, createCartItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledTimes(1);
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { productId: productId, cartId: cartId },
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
    });

    it('product quantity lack', async () => {
      const cartServicefindOneByUserIdSpy = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockResolvedValue(foundCart);

      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(undefined);

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundLackProduct);

      try {
        await cartItemService.create(userId, createCartItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductQuantityLackError);
        expect(err.message).toBe('product quantity lack');
        expect(err.status).toBe(400);
      }

      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledWith(userId);
      expect(cartServicefindOneByUserIdSpy).toHaveBeenCalledTimes(1);
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { productId: productId, cartId: cartId },
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('success', async () => {
      const cartServiceFindOneByUserId = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockResolvedValue(foundCart);

      const cartItemRepositoryFindSpy = jest
        .spyOn(cartItemRepository, 'find')
        .mockResolvedValue(savedCartItems);

      const result = await cartItemService.findAll(userId);

      expect(cartServiceFindOneByUserId).toHaveBeenCalledWith(userId);
      expect(cartServiceFindOneByUserId).toHaveBeenCalledTimes(1);
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledWith({
        cartId: cartId,
      });
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(cartAndCartItems);
    });

    it('cart not found', async () => {
      const cartServiceFindOneByUserId = jest
        .spyOn(cartService, 'findOneByUserId')
        .mockRejectedValue(new CartNotFoundError());

      try {
        await cartItemService.findAll(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(CartNotFoundError);
        expect(err.message).toBe('cart not found');
        expect(err.status).toBe(400);
      }

      expect(cartServiceFindOneByUserId).toHaveBeenCalledWith(userId);
      expect(cartServiceFindOneByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('success', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(savedCartItem);

      const result = await cartItemService.findOne(cartItemId);

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCartItem);
    });

    it('cart item not found', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await cartItemService.findOne(cartItemId);
      } catch (err) {
        expect(err).toBeInstanceOf(CartItemNotFoundError);
        expect(err.message).toBe('cart item not found');
        expect(err.status).toBe(400);
      }

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('success', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValueOnce(savedCartItem)
        .mockResolvedValueOnce(updatedCartItem);

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundEnoughProduct);

      const cartItemRepositoryUpdateSpy = jest
        .spyOn(cartItemRepository, 'update')
        .mockResolvedValue(updateCartResultSuccess);

      const cartItemRepositoryFindSpy = jest
        .spyOn(cartItemRepository, 'find')
        .mockResolvedValue(savedCartItems);

      const cartServiceUpdateSpy = jest
        .spyOn(cartService, 'update')
        .mockResolvedValue(updateCartResultSuccess);

      const result = await cartItemService.update(
        cartItemId,
        updateCartItemDto,
      );

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(2);
      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(2);
      expect(cartItemRepositoryUpdateSpy).toHaveBeenCalledWith(cartItemId, {
        quantity: updatedQuantity,
      });
      expect(cartItemRepositoryUpdateSpy).toHaveBeenCalledTimes(1);
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledWith({
        cartId: cartId,
      });
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(cartServiceUpdateSpy).toHaveBeenCalledWith(cartId, {
        total: updatedTotal,
      });
      expect(cartServiceUpdateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updatedCartItem);
    });

    it('cart item not found', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      try {
        await cartItemService.update(cartItemId, updateCartItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(CartItemNotFoundError);
        expect(err.message).toBe('cart item not found');
        expect(err.status).toBe(400);
      }

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });

    it('product not found', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValueOnce(savedCartItem)
        .mockResolvedValueOnce(updatedCartItem);

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockRejectedValue(new ProductNotFoundError());

      try {
        await cartItemService.update(cartItemId, updateCartItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
    });

    it('product quantity lack', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValueOnce(savedCartItem)
        .mockResolvedValueOnce(updatedCartItem);

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundLackProduct);

      try {
        await cartItemService.update(cartItemId, updateCartItemDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductQuantityLackError);
        expect(err.message).toBe('product quantity lack');
        expect(err.status).toBe(400);
      }

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('success', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(savedCartItem);

      const cartItemRepositorySoftDeleteSpy = jest
        .spyOn(cartItemRepository, 'softRemove')
        .mockResolvedValue(deletedCartItem);

      const result = await cartItemService.remove(cartItemId);

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(cartItemRepositorySoftDeleteSpy).toHaveBeenCalledWith(
        savedCartItem,
      );
      expect(cartItemRepositorySoftDeleteSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(deletedCartItem);
    });

    it('cart item not found', async () => {
      const cartItemRepositoryFindOneSpy = jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await cartItemService.remove(cartItemId);
      } catch (err) {
        expect(err).toBeInstanceOf(CartItemNotFoundError);
        expect(err.message).toBe('cart item not found');
        expect(err.status).toBe(400);
      }

      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: cartItemId,
      });
      expect(cartItemRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculateTotalPrice', () => {
    it('success', async () => {
      const cartItemRepositoryFindSpy = jest
        .spyOn(cartItemRepository, 'find')
        .mockResolvedValue(savedCartItems);

      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundEnoughProduct);

      const cartServiceUpdateSpy = jest
        .spyOn(cartService, 'update')
        .mockResolvedValue(updateCartResultSuccess);

      const result = await cartItemService.calculateTotalPrice(cartId);

      expect(cartItemRepositoryFindSpy).toHaveBeenCalledWith({
        cartId: cartId,
      });
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
      expect(cartServiceUpdateSpy).toHaveBeenCalledWith(cartId, {
        total: updatedTotal,
      });
      expect(cartServiceUpdateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updateCartResultSuccess);
    });

    it('no cart items', async () => {
      const cartItemRepositoryFindSpy = jest
        .spyOn(cartItemRepository, 'find')
        .mockResolvedValue([]);

      const cartServiceUpdateSpy = jest
        .spyOn(cartService, 'update')
        .mockResolvedValue(updateCartResultSuccess);

      const result = await cartItemService.calculateTotalPrice(cartId);

      expect(cartItemRepositoryFindSpy).toHaveBeenCalledWith({
        cartId: cartId,
      });
      expect(cartItemRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(cartServiceUpdateSpy).toHaveBeenCalledWith(cartId, {
        total: 0,
      });
      expect(cartServiceUpdateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updateCartResultSuccess);
    });
  });

  describe('checkProductQuantity', () => {
    it('success', async () => {
      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundEnoughProduct);

      const result = await cartItemService.checkProductQuantity(
        productId,
        cartItemQuantity,
      );

      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(foundEnoughProduct);
    });

    it('product not found', async () => {
      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockRejectedValue(new ProductNotFoundError());

      try {
        await cartItemService.checkProductQuantity(productId, cartItemQuantity);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
    });

    it('product quantity lack', async () => {
      const productServiceFindOneSpy = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(foundLackProduct);

      try {
        await cartItemService.checkProductQuantity(productId, cartItemQuantity);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductQuantityLackError);
        expect(err.message).toBe('product quantity lack');
        expect(err.status).toBe(400);
      }

      expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServiceFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });
});
