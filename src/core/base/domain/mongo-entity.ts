import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseMongoEntity<MongoModel> {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  input_by: string;

  @Prop()
  input_date?: Date;

  @Prop()
  deleted_by?: string;

  @Prop()
  deleted_date?: Date;

  @Prop({ type: [{ edit_by: String, edit_date: Date, changelog: String }] })
  edit_history?: {
    edit_by: string;
    edit_date: Date;
    changelog: string;
  }[];

  @Prop()
  edit_by?: string;

  @Prop({ default: false })
  b?: boolean;

  constructor(props?: MongoModel) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
