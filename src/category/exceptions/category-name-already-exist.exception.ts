import { BadRequestException } from '@nestjs/common';

export class CategoryNameAlreadyExistsException extends BadRequestException {
  constructor(error?: string) {
    super('category name already exist', error);
  }
}
