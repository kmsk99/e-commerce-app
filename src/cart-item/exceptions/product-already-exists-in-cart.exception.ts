import { BadRequestException } from '@nestjs/common';

export class ProductAlreadyExistsInCartError extends BadRequestException {
  constructor(error?: string) {
    super('product already exists in cart', error);
  }
}
