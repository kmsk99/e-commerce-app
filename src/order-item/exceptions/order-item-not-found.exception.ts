import { BadRequestException } from '@nestjs/common';

export class OrderItemNotFoundError extends BadRequestException {
  constructor(error?: string) {
    super('order item not found', error);
  }
}
