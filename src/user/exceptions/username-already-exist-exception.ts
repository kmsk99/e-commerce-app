import { BadRequestException } from '@nestjs/common';

export class UsernameAlreadyExistsException extends BadRequestException {
  constructor(error?: string) {
    super('username already exist', error);
  }
}
