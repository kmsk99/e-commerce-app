import { EntityRepository, Repository } from 'typeorm';
import { CartItemEntity } from './entities/cart-item.entity';

@EntityRepository(CartItemEntity)
export class CartItemRepository extends Repository<CartItemEntity> {}
