import { BadRequestException } from '@nestjs/common';

export class CartEmptyError extends BadRequestException {
  constructor(error?: string) {
    super('cart empty', error);
  }
}
