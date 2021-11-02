import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemService {
  create(userId: number, createCartItemDto: CreateCartItemDto) {
    return new Promise(() => {
      return '';
    });
  }

  findAll(userId: number) {
    return new Promise(() => {
      return '';
    });
  }

  findOne(userId: number, id: number) {
    return new Promise(() => {
      return '';
    });
  }

  update(userId: number, id: number, updateCartItemDto: UpdateCartItemDto) {
    return new Promise(() => {
      return '';
    });
  }

  remove(userId: number, id: number) {
    return new Promise(() => {
      return '';
    });
  }
}
