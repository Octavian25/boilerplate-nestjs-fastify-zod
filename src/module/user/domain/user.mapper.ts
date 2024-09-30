import { UserEntity } from './user.entity';
import { UserMongoEntity } from '../repository/user.mongo-entity';
import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { staticImplements } from 'src/core/decorator/static-implements.decorator';
import { UserLevel } from './value-objects/user-level.value-object';

@staticImplements<DbMapper<UserEntity, UserMongoEntity>>()
export class UserMapper {
  public static toPlainObject(
    entity: UserEntity,
  ): MongoEntityProps<UserMongoEntity> {
    const entityProps = entity.propsCopy;

    return {
      ...entityProps,
      level: entityProps.level.value,
    };
  }
  public static toDomain(raw: UserMongoEntity): UserEntity {
    return new UserEntity(
      {
        user_id: raw.user_id,
        user_name: raw.user_name,
        password: raw.password,
        level: new UserLevel(raw.level),
        input_by: raw.input_by,
        input_date: raw.input_date,
        deleted_by: raw.deleted_by,
        deleted_date: raw.deleted_date,
        edit_history: raw.edit_history,
      },
      raw._id,
    );
  }
}
