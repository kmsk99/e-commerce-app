import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { validate } from 'class-validator';
import { CategoryEntity } from './entities/category.entity';
import { CategoryNotFoundError } from './exceptions/category-not-found-exception';
import { CategoryNotUpdatedError } from './exceptions/category-not-updated-exception';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const validation_error = await validate(createCategoryDto);
    if (validation_error.length > 0) {
      throw new HttpException(validation_error, HttpStatus.BAD_REQUEST);
    }

    const { name } = createCategoryDto;

    const newCategory = new CategoryEntity();
    newCategory.name = name;

    const result = await this.categoryRepository.save(newCategory);

    return result;
  }

  async findAll() {
    const result = await this.categoryRepository.find();
    return result;
  }

  async findOne(id: number) {
    const result = await this.categoryRepository.findOne({ where: { id: id } });

    if (!result) {
      throw new CategoryNotFoundError();
    }

    return result;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const updatedCategory = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );

    if (updatedCategory.generatedMaps.length === 0) {
      throw new CategoryNotUpdatedError();
    }

    const result = await this.findOne(id);

    return result;
  }

  async remove(id: number) {
    const thisCategory = await this.findOne(id);
    const result = await this.categoryRepository.softRemove(thisCategory);

    return result;
  }
}
