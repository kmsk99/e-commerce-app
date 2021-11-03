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
  const username = faker.internet.userName();
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

  const updatedCart: CartEntity = {
    id: cartId,
    userId: userId,
    total: updatedTotal,
    createdAt: createdAt,
    updatedAt: updatedUpdatedAt,
    deletedAt: undefined,
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

      const productServicefindOneSpy = jest
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
      expect(productServicefindOneSpy).toHaveBeenCalledWith(productId);
      expect(productServicefindOneSpy).toHaveBeenCalledTimes(2);
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
  });
  //   it.todo('cart not found', async () => {
  //     const categoryServiceFindOneSpy = jest
  //       .spyOn(categoryService, 'findOne')
  //       .mockRejectedValue(new CategoryNotFoundError());

  //     try {
  //       await productService.create(createProductDto);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(CategoryNotFoundError);
  //       expect(err.message).toBe('category not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledWith(categoryId);
  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledTimes(1);
  //   });

  //   it.todo('product not found', async () => {
  //     const categoryServiceFindOneSpy = jest
  //       .spyOn(categoryService, 'findOne')
  //       .mockRejectedValue(new CategoryNotFoundError());

  //     try {
  //       await productService.create(createProductDto);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(CategoryNotFoundError);
  //       expect(err.message).toBe('category not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledWith(categoryId);
  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  //   it.todo('product quantity lack', async () => {
  //     const categoryServiceFindOneSpy = jest
  //       .spyOn(categoryService, 'findOne')
  //       .mockRejectedValue(new CategoryNotFoundError());

  //     try {
  //       await productService.create(createProductDto);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(CategoryNotFoundError);
  //       expect(err.message).toBe('category not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledWith(categoryId);
  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('findAll', () => {
  //   it.todo('success', async () => {
  //     const productRepositoryFindSpy = jest
  //       .spyOn(productRepository, 'find')
  //       .mockResolvedValue(savedProducts);

  //     const result = await productService.findAll();

  //     expect(productRepositoryFindSpy).toHaveBeenCalledWith();
  //     expect(productRepositoryFindSpy).toHaveBeenCalledTimes(1);
  //     expect(result).toStrictEqual(savedProducts);
  //   });
  //   it.todo('cart not found', async () => {
  //     const categoryServiceFindOneSpy = jest
  //       .spyOn(categoryService, 'findOne')
  //       .mockRejectedValue(new CategoryNotFoundError());

  //     try {
  //       await productService.create(createProductDto);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(CategoryNotFoundError);
  //       expect(err.message).toBe('category not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledWith(categoryId);
  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('findOne', () => {
  //   it.todo('success', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValue(savedProduct);

  //     const result = await productService.findOne(productId);

  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
  //     expect(result).toStrictEqual(savedProduct);
  //   });
  //   it.todo('cart item not found', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValue(null);

  //     try {
  //       await productService.findOne(productId);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(ProductNotFoundError);
  //       expect(err.message).toBe('product not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('update', () => {
  //   it.todo('success', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValueOnce(savedProduct)
  //       .mockResolvedValueOnce(updatedProduct);

  //     const categoryServiceFindOneSpy = jest
  //       .spyOn(categoryService, 'findOne')
  //       .mockResolvedValue({
  //         id: changedCategoryId,
  //         ...foundCategoryId,
  //       });

  //     const productRepositoryUpdateSpy = jest
  //       .spyOn(productRepository, 'update')
  //       .mockResolvedValue(updateResultSuccess);

  //     const result = await productService.update(productId, updateProductDto);

  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledWith(changedCategoryId);
  //     expect(categoryServiceFindOneSpy).toHaveBeenCalledTimes(1);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(2);
  //     expect(productRepositoryUpdateSpy).toHaveBeenCalledWith(
  //       productId,
  //       updateProductDto,
  //     );
  //     expect(productRepositoryUpdateSpy).toHaveBeenCalledTimes(1);
  //     expect(result).toStrictEqual(updatedProduct);
  //   });
  //   it.todo('cart item not found', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValue(null);

  //     try {
  //       await productService.update(productId, updateProductDto);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(ProductNotFoundError);
  //       expect(err.message).toBe('product not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  //   it.todo('product not found', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValue(null);

  //     try {
  //       await productService.update(productId, updateProductDto);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(ProductNotFoundError);
  //       expect(err.message).toBe('product not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  //   it.todo('product quantity lack', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValue(null);

  //     try {
  //       await productService.update(productId, updateProductDto);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(ProductNotFoundError);
  //       expect(err.message).toBe('product not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('remove', () => {
  //   it.todo('success', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValue(savedProduct);

  //     const productRepositorySoftDeleteSpy = jest
  //       .spyOn(productRepository, 'softRemove')
  //       .mockResolvedValue(deletedProduct);

  //     const result = await productService.remove(productId);

  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
  //     expect(productRepositorySoftDeleteSpy).toHaveBeenCalledWith(savedProduct);
  //     expect(productRepositorySoftDeleteSpy).toHaveBeenCalledTimes(1);
  //     expect(result).toStrictEqual(deletedProduct);
  //   });
  //   it.todo('cart item not found', async () => {
  //     const findParam = {
  //       where: { id: productId },
  //     };

  //     const productRepositoryFindOneSpy = jest
  //       .spyOn(productRepository, 'findOne')
  //       .mockResolvedValue(null);

  //     try {
  //       await productService.remove(productId);
  //     } catch (err) {
  //       expect(err).toBeInstanceOf(ProductNotFoundError);
  //       expect(err.message).toBe('product not found');
  //       expect(err.status).toBe(400);
  //     }

  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
  //     expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('calculateTotalPrice', () => {
  //   it.todo('success');
  //   it.todo('cart not found');
  // });

  // describe('checkProductQuantity', () => {
  //   it.todo('success');
  //   it.todo('product not found');
  //   it.todo('product quantity lack');
  // });
});
