import { BadRequestException } from '@nestjs/common';

export class OrderNotFoundError extends BadRequestException {
  constructor(error?: string) {
    super('order not found', error);
  }
}
