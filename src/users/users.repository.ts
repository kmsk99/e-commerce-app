import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from './entities/users.entity';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {}
