import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import * as faker from 'faker';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './category.repository';
import { UpdateResult } from 'typeorm';
import { CategoryNotFoundError } from './exceptions/category-not-found.exception';
import { CategoryNameAlreadyExistsException } from './exceptions/category-name-already-exist.exception';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: CategoryRepository;

  const categoryId = faker.datatype.number();
  const randomCategoryName = faker.commerce.productAdjective();
  const updatedCategoryName = faker.commerce.productAdjective();
  const createdAt = faker.date.recent();
  const updatedAt = faker.date.recent();
  const deletedAt = faker.date.recent();
  const updatedUpdatedAt = faker.date.recent();

  const createCategoryDto: CreateCategoryDto = {
    name: randomCategoryName,
  };

  const updateCategoryDto: UpdateCategoryDto = {
    name: updatedCategoryName,
  };

  const savedCategory: CategoryEntity = {
    id: categoryId,
    name: randomCategoryName,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
  };

  const updatedCategory: CategoryEntity = {
    id: categoryId,
    name: randomCategoryName,
    createdAt: createdAt,
    updatedAt: updatedUpdatedAt,
    deletedAt: null,
  };

  const deletedCategory: CategoryEntity = {
    id: categoryId,
    name: randomCategoryName,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
  };

  const updateResultSuccess: UpdateResult = {
    generatedMaps: [
      {
        id: categoryId,
        createdAt: createdAt,
        updatedAt: updatedUpdatedAt,
      },
    ],
    raw: [
      {
        id: categoryId,
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
    ],
  };

  const savedCategories = [savedCategory];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, CategoryRepository],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('create', () => {
    it('success', async () => {
      const findParam = {
        where: { name: randomCategoryName },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(undefined);

      const categoryRepositorySaveSpy = jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(savedCategory);

      const result = await categoryService.create(createCategoryDto);

      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(categoryRepositorySaveSpy).toHaveBeenCalledWith(createCategoryDto);
      expect(categoryRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCategory);
    });

    it('category name already exist', async () => {
      const findParam = {
        where: { name: randomCategoryName },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(savedCategory);

      try {
        await categoryService.create(createCategoryDto);
      } catch (err) {
        expect(err).toBeInstanceOf(CategoryNameAlreadyExistsException);
        expect(err.message).toBe('category name already exist');
        expect(err.status).toBe(400);
      }

      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(categoryRepositoryFindOneSpy).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('success', async () => {
      const categoryRepositoryFindSpy = jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValue(savedCategories);

      const result = await categoryService.findAll();

      expect(categoryRepositoryFindSpy).toHaveBeenCalledWith();
      expect(categoryRepositoryFindSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCategories);
    });
  });

  describe('findOne', () => {
    it('success', async () => {
      const findParam = {
        where: { id: categoryId },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(savedCategory);

      const result = await categoryService.findOne(categoryId);

      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(savedCategory);
    });

    it('category not found', async () => {
      const findParam = {
        where: { id: categoryId },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await categoryService.findOne(categoryId);
      } catch (err) {
        expect(err).toBeInstanceOf(CategoryNotFoundError);
        expect(err.message).toBe('category not found');
        expect(err.status).toBe(400);
      }

      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('success', async () => {
      const findParam1 = {
        where: { id: categoryId },
      };

      const findParam2 = {
        where: { name: updatedCategoryName },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(savedCategory)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(updatedCategory);

      const categoryRepositoryUpdateSpy = jest
        .spyOn(categoryRepository, 'update')
        .mockResolvedValue(updateResultSuccess);

      const result = await categoryService.update(
        categoryId,
        updateCategoryDto,
      );

      expect(categoryRepositoryFindOneSpy).toHaveBeenNthCalledWith(
        1,
        findParam1,
      );
      expect(categoryRepositoryFindOneSpy).toHaveBeenNthCalledWith(
        2,
        findParam2,
      );
      expect(categoryRepositoryFindOneSpy).toHaveBeenNthCalledWith(
        3,
        findParam1,
      );
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(3);
      expect(categoryRepositoryUpdateSpy).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(categoryRepositoryUpdateSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updatedCategory);
    });

    it('category not found', async () => {
      const findParam = {
        where: { id: categoryId },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await categoryService.update(categoryId, updateCategoryDto);
      } catch (err) {
        expect(err).toBeInstanceOf(CategoryNotFoundError);
        expect(err.message).toBe('category not found');
        expect(err.status).toBe(400);
      }

      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });

    it('category name already exist', async () => {
      const findParam1 = {
        where: { id: categoryId },
      };

      const findParam2 = {
        where: { name: updatedCategoryName },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(savedCategory)
        .mockResolvedValueOnce(savedCategory);

      try {
        await categoryService.update(categoryId, updateCategoryDto);
      } catch (err) {
        expect(err).toBeInstanceOf(CategoryNameAlreadyExistsException);
        expect(err.message).toBe('category name already exist');
        expect(err.status).toBe(400);
      }

      expect(categoryRepositoryFindOneSpy).toHaveBeenNthCalledWith(
        1,
        findParam1,
      );
      expect(categoryRepositoryFindOneSpy).toHaveBeenNthCalledWith(
        2,
        findParam2,
      );
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('remove', () => {
    it('success', async () => {
      const findParam = {
        where: { id: categoryId },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(savedCategory);

      const categoryRepositorySoftDeleteSpy = jest
        .spyOn(categoryRepository, 'softRemove')
        .mockResolvedValue(deletedCategory);

      const result = await categoryService.remove(categoryId);

      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(categoryRepositorySoftDeleteSpy).toHaveBeenCalledWith(
        savedCategory,
      );
      expect(categoryRepositorySoftDeleteSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(deletedCategory);
    });

    it('category not found', async () => {
      const findParam = {
        where: { id: categoryId },
      };

      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await categoryService.remove(categoryId);
      } catch (err) {
        expect(err).toBeInstanceOf(CategoryNotFoundError);
        expect(err.message).toBe('category not found');
        expect(err.status).toBe(400);
      }

      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(findParam);
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
    });
  });
});
