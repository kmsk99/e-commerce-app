import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from './entities/Category.entity';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {}
