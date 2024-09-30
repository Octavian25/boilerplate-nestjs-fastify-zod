import { BaseRepositoryPort } from '../../../core/port/repository.base.port';
import { UserEntity } from '../domain/user.entity';
import { UserMongoEntity } from './user.mongo-entity';

export interface UserRepositoryPort
  extends BaseRepositoryPort<UserEntity, UserMongoEntity> {
  findActiveUser(): Promise<Array<UserMongoEntity>>;
}
