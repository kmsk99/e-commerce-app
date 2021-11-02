import { BadRequestException } from '@nestjs/common';

export class ProductQuantityLackError extends BadRequestException {
  constructor(error?: string) {
    super('product quantity lack', error);
  }
}
