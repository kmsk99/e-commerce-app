import { BadRequestException } from '@nestjs/common';

export class CartItemNotFoundError extends BadRequestException {
  constructor(error?: string) {
    super('cart item not found', error);
  }
}
