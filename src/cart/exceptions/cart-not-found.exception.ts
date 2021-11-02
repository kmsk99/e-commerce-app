import { BadRequestException } from '@nestjs/common';

export class CartNotFoundError extends BadRequestException {
  constructor(error?: string) {
    super('cart not found', error);
  }
}
