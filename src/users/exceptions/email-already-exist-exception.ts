import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistsException extends BadRequestException {
  constructor(error?: string) {
    super('email already exist', error);
  }
}
