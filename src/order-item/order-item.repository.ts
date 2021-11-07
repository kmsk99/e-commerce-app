import { EntityRepository, Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';

@EntityRepository(OrderItemEntity)
export class OrderItemRepository extends Repository<OrderItemEntity> {}
