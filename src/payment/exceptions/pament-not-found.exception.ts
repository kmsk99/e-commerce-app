import { BadRequestException } from '@nestjs/common';

export class PaymentNotFoundError extends BadRequestException {
  constructor(error?: string) {
    super('payment not found', error);
  }
}
