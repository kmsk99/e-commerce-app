import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import * as faker from 'faker';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductNotFoundError } from './exceptions/product-not-found-exception';
import { UpdateResult } from 'typeorm';
import { CategoryEntity } from '@root/category/entities/category.entity';
import { CategoryService } from '@root/category/category.service';
import { CategoryNotFoundError } from '@root/category/exceptions/category-not-found-exception';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;
  let categoryService: CategoryService;

  const productId = faker.datatype.number();
  const randomProductName = faker.commerce.productName();
  const randomProductPrice = +faker.commerce.price();
  const categoryId = faker.datatype.number();
  const quantity = faker.datatype.number();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const deletedAt = faker.date.recent();
  const changedRandomProductName = faker.commerce.productName();
  const changedRandomProductPrice = +faker.commerce.price();
  const changedCategoryId = faker.datatype.number();
  const changedQuantity = faker.datatype.number();
  const updatedUpdatedAt = faker.date.recent();

  const createProductDto: CreateProductDto = {
    name: randomProductName,
    categoryId: categoryId,
    quantity: quantity,
    price: randomProductPrice,
  };

  const updateProductDto: UpdateProductDto = {
    name: changedRandomProductName,
    categoryId: changedRandomProductPrice,
    quantity: changedCategoryId,
    price: changedQuantity,
  };

  const savedProduct: ProductEntity = {
    id: productId,
    name: randomProductName,
    categoryId: categoryId,
    quantity: quantity,
    price: randomProductPrice,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
  };

  const updatedProduct: ProductEntity = {
    id: productId,
    name: changedRandomProductName,
    categoryId: changedRandomProductPrice,
    quantity: changedCategoryId,
    price: changedQuantity,
    createdAt: createdAt,
    updatedAt: updatedUpdatedAt,
    deletedAt: null,
  };

  const deletedProduct: ProductEntity = {
    id: productId,
    name: randomProductName,
    categoryId: categoryId,
    quantity: quantity,
    price: randomProductPrice,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
  };

  const updateResultSuccess: UpdateResult = {
    generatedMaps: [
      {
        id: productId,
        createdAt: createdAt,
        updatedAt: updatedUpdatedAt,
      },
    ],
    raw: [
      {
        id: productId,
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
    ],
  };

  const foundCategoryId: CategoryEntity = {
    id: categoryId,
    name: faker.commerce.productAdjective(),
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
  };

  const savedProducts = [savedProduct];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, ProductRepository],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  describe('create', () => {
    it('success', async () => {
      const categoryServiceFindOneSpy = jest
        .spyOn(categoryService, 'findOne')
        .mockResolvedValue(foundCategoryId);

      const productRepositorySaveSpy = jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(savedProduct);

      const result = await productService.create(createProductDto);

      expect(categoryServiceFindOneSpy).toHaveBeenCalledWith(
        createProductDto.categoryId,
      );
      expect(categoryServiceFindOneSpy).toHaveBeenCalledTimes(1);
      expect(productRepositorySaveSpy).toHaveBeenCalledWith(createProductDto);
      expect(productRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedProduct);
    });
  });

  describe('findAll', () => {
    it('success', async () => {
      const productRepositoryFindSpy = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(savedProducts);

      const result = await productService.findAll();

      expect(productRepositoryFindSpy).toHaveBeenCalledWith();
      expect(productRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedProducts);
    });
  });

  describe('findByCategory', () => {
    it('success', async () => {
      const findParam = {
        where: { category_id: categoryId },
      };

      const productRepositoryFindSpy = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(savedProducts);

      const result = await productService.findByCategory(categoryId);

      expect(productRepositoryFindSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedProducts);
    });

    it('category not found', async () => {
      const findParam = {
        where: { category_id: categoryId },
      };

      const productRepositoryFindSpy = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue([]);

      try {
        await productService.findByCategory(categoryId);
      } catch (err) {
        expect(err).toBeInstanceOf(CategoryNotFoundError);
        expect(err.message).toBe('category not found');
        expect(err.status).toBe(400);
      }

      expect(productRepositoryFindSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('success', async () => {
      const findParam = {
        where: { id: productId },
      };

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(savedProduct);

      const result = await productService.findOne(productId);

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedProduct);
    });

    it('product not found', async () => {
      const findParam = {
        where: { id: productId },
      };

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await productService.findOne(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('success', async () => {
      const findParam = {
        where: { id: productId },
      };

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(savedProduct)
        .mockResolvedValueOnce(updatedProduct);

      const productRepositoryUpdateSpy = jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue(updateResultSuccess);

      const result = await productService.update(productId, updateProductDto);

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(2);
      expect(productRepositoryUpdateSpy).toHaveBeenCalledWith(
        productId,
        updateProductDto,
      );
      expect(productRepositoryUpdateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updatedProduct);
    });

    it('product not found', async () => {
      const findParam = {
        where: { id: productId },
      };

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await productService.update(productId, updateProductDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('success', async () => {
      const findParam = {
        where: { id: productId },
      };

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(savedProduct);

      const productRepositorySoftDeleteSpy = jest
        .spyOn(productRepository, 'softRemove')
        .mockResolvedValue(deletedProduct);

      const result = await productService.remove(productId);

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(productRepositorySoftDeleteSpy).toHaveBeenCalledWith(savedProduct);
      expect(productRepositorySoftDeleteSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(deletedProduct);
    });

    it('product not found', async () => {
      const findParam = {
        where: { id: productId },
      };

      const productRepositoryFindOneSpy = jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await productService.remove(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundError);
        expect(err.message).toBe('product not found');
        expect(err.status).toBe(400);
      }

      expect(productRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(productRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });
});
