import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import * as faker from 'faker';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

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
  const updeatedupdatedAt = faker.date.recent();

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
    updatedAt: updeatedupdatedAt,
    deletedAt: null,
  };

  const deletedProduct: ProductEntity = {
    id: productId,
    name: changedRandomProductName,
    categoryId: changedRandomProductPrice,
    quantity: changedCategoryId,
    price: changedQuantity,
    createdAt: createdAt,
    updatedAt: updeatedupdatedAt,
    deletedAt: deletedAt,
  };

  const savedProducts = [savedProduct];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByCategory: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productController = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productController).toBeDefined();
  });

  describe('/products', () => {
    it('POST', async () => {
      const productServiceCreateSpy = jest
        .spyOn(productService, 'create')
        .mockResolvedValue(savedProduct);

      const result = await productController.create(createProductDto);

      expect(productServiceCreateSpy).toHaveBeenCalledWith(createProductDto);
      expect(productServiceCreateSpy).toBeCalledTimes(1);
      expect(result).toBe(savedProduct);
    });

    it('GET', async () => {
      const productServiceFindAllSpy = jest
        .spyOn(productService, 'findAll')
        .mockResolvedValue(savedProducts);

      const result = await productController.findAll();

      expect(productServiceFindAllSpy).toHaveBeenCalledWith();
      expect(productServiceFindAllSpy).toBeCalledTimes(1);
      expect(result).toBe(savedProducts);
    });

    describe('?category=query', () => {
      it('GET', async () => {
        const query = faker.commerce.productAdjective();

        const productServiceFindByCategorySpy = jest
          .spyOn(productService, 'findByCategory')
          .mockResolvedValue(savedProducts);

        const result = await productController.findByCategory(query);

        expect(productServiceFindByCategorySpy).toHaveBeenCalledWith(query);
        expect(productServiceFindByCategorySpy).toBeCalledTimes(1);
        expect(result).toBe(savedProducts);
      });
    });

    describe('/:id', () => {
      it('GET', async () => {
        const productServiceFindOneSpy = jest
          .spyOn(productService, 'findOne')
          .mockResolvedValue(savedProduct);

        const result = await productController.findOne(String(productId));

        expect(productServiceFindOneSpy).toHaveBeenCalledWith(productId);
        expect(productServiceFindOneSpy).toBeCalledTimes(1);
        expect(result).toBe(savedProduct);
      });

      it('PATCH', async () => {
        const productServiceUpdateSpy = jest
          .spyOn(productService, 'update')
          .mockResolvedValue(updatedProduct);

        const result = await productController.update(
          String(productId),
          updateProductDto,
        );

        expect(productServiceUpdateSpy).toHaveBeenCalledWith(
          productId,
          updateProductDto,
        );
        expect(productServiceUpdateSpy).toBeCalledTimes(1);
        expect(result).toBe(updatedProduct);
      });

      it('DELETE', async () => {
        const productServiceRemoveSpy = jest
          .spyOn(productService, 'remove')
          .mockResolvedValue(deletedProduct);

        const result = await productController.remove(String(productId));

        expect(productServiceRemoveSpy).toHaveBeenCalledWith(productId);
        expect(productServiceRemoveSpy).toBeCalledTimes(1);
        expect(result).toBe(deletedProduct);
      });
    });
  });
});
