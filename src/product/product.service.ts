import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductQuantityLackError } from '@root/cart-item/exceptions/product-quantity-lack.exception';
import { CategoryService } from '@root/category/category.service';
import { validate } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductNotFoundError } from './exceptions/product-not-found.exception';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const validation_error = await validate(createProductDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { name, categoryId, price, quantity } = createProductDto;

    await this.categoryService.findOne(categoryId);

    const newProduct = new ProductEntity();
    newProduct.name = name;
    newProduct.categoryId = categoryId;
    newProduct.price = price;
    newProduct.quantity = quantity;

    const result = await this.productRepository.save(newProduct);

    return result;
  }

  async findAll() {
    const result = await this.productRepository.find();
    return result;
  }

  async findByCategory(categoryId: number) {
    await this.categoryService.findOne(categoryId);

    const result = await this.productRepository.find({
      where: { categoryId: categoryId },
    });

    return result;
  }

  async findOne(id: number) {
    const result = await this.productRepository.findOne({ where: { id: id } });

    if (!result) {
      throw new ProductNotFoundError();
    }

    return result;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    await this.categoryService.findOne(updateProductDto.categoryId);

    await this.productRepository.update(id, updateProductDto);

    const result = await this.findOne(id);

    return result;
  }

  async remove(id: number) {
    const thisProduct = await this.findOne(id);
    const result = await this.productRepository.softRemove(thisProduct);

    return result;
  }

  async sold(id: number, quantity: number) {
    const thisProduct = await this.findOne(id);

    if (thisProduct.quantity - quantity < 0) {
      throw new ProductQuantityLackError();
    }

    await this.productRepository.update(id, {
      quantity: thisProduct.quantity - quantity,
    });

    const result = await this.findOne(id);

    return result;
  }
}
