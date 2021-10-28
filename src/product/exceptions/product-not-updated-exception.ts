import { BadRequestException } from '@nestjs/common';

export class ProductNotUpdatedError extends BadRequestException {
  constructor(error?: string) {
    super('product not updated', error);
  }
}
