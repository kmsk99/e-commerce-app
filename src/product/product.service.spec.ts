import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import * as faker from 'faker';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UserRepository } from '@root/user/user.repository';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  const productId = faker.datatype.number();
  const randomProductName = faker.commerce.productName();
  const randomProductPrice = +faker.commerce.price();
  const categoryId = faker.datatype.number();
  const quantity = faker.datatype.number();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const deletedAt = undefined;
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
    deletedAt: deletedAt,
  };

  const updatedProduct: ProductEntity = {
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
      providers: [ProductService, UserRepository],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
  });
});
