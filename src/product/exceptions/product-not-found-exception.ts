import { BadRequestException } from '@nestjs/common';

export class ProductNotFoundError extends BadRequestException {
  constructor(error?: string) {
    super('product not found', error);
  }
}
