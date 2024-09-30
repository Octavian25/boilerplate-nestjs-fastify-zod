import { Types } from 'mongoose';
export type MongoEntityProps<MongoEntity> = Omit<MongoEntity, '_id'> & {
  _id: Types.ObjectId;
};

export interface DbMapper<Entity, MongoEntity> {
  toPlainObject(entity: Entity): MongoEntityProps<MongoEntity>;
  toDomain(raw: MongoEntity): Entity;
}
