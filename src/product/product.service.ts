import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto) {
    const result = new Promise(() => {
      'This action adds a new product';
    });
    return await result;
  }

  async findAll() {
    const result = new Promise(() => {
      `This action returns all product`;
    });
    return await result;
  }

  async findByCategory(category: string) {
    const result = new Promise(() => {
      `This action returns a #${category} product`;
    });
    return await result;
  }

  async findOne(id: number) {
    const result = new Promise(() => {
      `This action returns a #${id} product`;
    });
    return await result;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const result = new Promise(() => {
      `This action updates a #${id} product`;
    });
    return await result;
  }

  async remove(id: number) {
    const result = new Promise(() => {
      `This action removes a #${id} product`;
    });
    return await result;
  }
}
