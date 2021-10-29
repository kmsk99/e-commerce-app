import { BadRequestException } from '@nestjs/common';

export class CategoryNotUpdatedError extends BadRequestException {
  constructor(error?: string) {
    super('category not updated', error);
  }
}
