import { BadRequestException } from '@nestjs/common';

export class PaymentAlreadyExistsException extends BadRequestException {
  constructor(error?: string) {
    super('payment already exists', error);
  }
}
