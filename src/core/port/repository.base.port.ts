import {
  ClientSession,
  Document,
  FilterQuery,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
import { IPaginationMeta } from '../interface/pagination-meta.interface';
import { IRepositoryResponse } from '../interface/repository-response.interface';

export interface BaseRepositoryPort<Entity, MongoEntity> {
  findAll(session?: ClientSession): Promise<Entity[]>;
  findOne(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<Entity | undefined>;

  findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<Entity>;

  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<void>;

  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<void>;

  findOneLatest(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<Entity | undefined>;
  findById(
    id: Types.ObjectId,
    session?: ClientSession,
  ): Promise<Entity | undefined>;
  findBy(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<Entity[]>;
  findByPaginated(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
  ): Promise<Entity[]>;
  findByPaginateSorted(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
    sort: { [key: string]: SortOrder | { $meta: any } },
  ): Promise<Entity[]>;
  count(): Promise<number>;
  countBy(identifier: FilterQuery<MongoEntity>): Promise<number>;
  save(entity: Entity, session?: ClientSession): Promise<IRepositoryResponse>;
  saveReturnDocument(
    entity: Entity,
    session?: ClientSession,
  ): Promise<Document<any, any>>;
  saveMany(
    entity: Entity[],
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateOne(
    identifier: FilterQuery<MongoEntity>,
    data: Entity,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateOneWithoutThrow(
    identifier: FilterQuery<MongoEntity>,
    data: Entity,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateMany(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  delete(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  deleteWithoutThrow(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  deleteAll(session?: ClientSession): Promise<IRepositoryResponse>;
}
