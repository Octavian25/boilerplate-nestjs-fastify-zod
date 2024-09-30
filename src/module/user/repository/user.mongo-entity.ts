import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { addEditHistory } from 'src/core/base/domain/changelog-schema';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'tm_user' })
export class UserMongoEntity extends BaseMongoEntity<typeof UserMongoEntity> {
  @Prop({ required: true, unique: true })
  user_id: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  level: string;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoEntity);
UserSchema.plugin(addEditHistory);
export const UserModel = [{ name: UserMongoEntity.name, schema: UserSchema }];
