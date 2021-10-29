import { BadRequestException } from '@nestjs/common';

export class CategoryNotFoundError extends BadRequestException {
  constructor(error?: string) {
    super('category not found', error);
  }
}
