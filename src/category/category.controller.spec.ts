import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import * as faker from 'faker';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { CategoryNameAlreadyExistsException } from './exceptions/category-name-already-exist-exception';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

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

  const savedCategories = [savedCategory];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  describe('/category', () => {
    describe('POST', () => {
      it('success', async () => {
        const categoryServiceCreateSpy = jest
          .spyOn(categoryService, 'create')
          .mockResolvedValue(savedCategory);

        const result = await categoryController.create(createCategoryDto);

        expect(categoryServiceCreateSpy).toHaveBeenCalledWith(
          createCategoryDto,
        );
        expect(categoryServiceCreateSpy).toBeCalledTimes(1);
        expect(result).toBe(savedCategory);
      });

      it('category name already exist', async () => {
        const categoryServiceCreateSpy = jest
          .spyOn(categoryService, 'create')
          .mockRejectedValue(new CategoryNameAlreadyExistsException());

        try {
          await categoryController.create(createCategoryDto);
        } catch (err) {
          expect(err).toBeInstanceOf(CategoryNameAlreadyExistsException);
          expect(err.message).toBe('category name already exist');
          expect(err.status).toBe(400);
        }

        expect(categoryServiceCreateSpy).toHaveBeenCalledWith(
          createCategoryDto,
        );
        expect(categoryServiceCreateSpy).toBeCalledTimes(1);
      });
    });

    it('GET', async () => {
      const categoryServiceFindAllSpy = jest
        .spyOn(categoryService, 'findAll')
        .mockResolvedValue(savedCategories);

      const result = await categoryController.findAll();

      expect(categoryServiceFindAllSpy).toHaveBeenCalledWith();
      expect(categoryServiceFindAllSpy).toBeCalledTimes(1);
      expect(result).toBe(savedCategories);
    });

    describe('/:id', () => {
      it('GET', async () => {
        const categoryServiceFindOneSpy = jest
          .spyOn(categoryService, 'findOne')
          .mockResolvedValue(savedCategory);

        const result = await categoryController.findOne(String(categoryId));

        expect(categoryServiceFindOneSpy).toHaveBeenCalledWith(categoryId);
        expect(categoryServiceFindOneSpy).toBeCalledTimes(1);
        expect(result).toBe(savedCategory);
      });

      it('PATCH', async () => {
        const categoryServiceUpdateSpy = jest
          .spyOn(categoryService, 'update')
          .mockResolvedValue(updatedCategory);

        const result = await categoryController.update(
          String(categoryId),
          updateCategoryDto,
        );

        expect(categoryServiceUpdateSpy).toHaveBeenCalledWith(
          categoryId,
          updateCategoryDto,
        );
        expect(categoryServiceUpdateSpy).toBeCalledTimes(1);
        expect(result).toBe(updatedCategory);
      });

      it('DELETE', async () => {
        const categoryServiceRemoveSpy = jest
          .spyOn(categoryService, 'remove')
          .mockResolvedValue(deletedCategory);

        const result = await categoryController.remove(String(categoryId));

        expect(categoryServiceRemoveSpy).toHaveBeenCalledWith(categoryId);
        expect(categoryServiceRemoveSpy).toBeCalledTimes(1);
        expect(result).toBe(deletedCategory);
      });
    });
  });
});
