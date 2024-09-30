import { Entity } from 'src/core/base/domain/entity';
import { HashService } from 'src/helper/module/hash.service';
import { UserLevel } from './value-objects/user-level.value-object';
import { Types } from 'mongoose';
import { IDefaultInfo } from 'src/core/interface/default_info.interface';
import { JwtDecoded } from 'src/core/base/module/use-case.base';

export interface UserProps extends IDefaultInfo {
  user_id: string;
  user_name: string;
  password: string;
  level: UserLevel;
}

export interface UpdateUserProps {
  user_name: string;
  level: string;
}

export class UserEntity extends Entity<UserProps> {
  private static hashUtil: HashService = new HashService();

  constructor(props: UserProps, _id?: Types.ObjectId) {
    super(props, _id);
  }

  static async create(props: UserProps) {
    const hashPassword = await this.hashUtil.generate(props.password);

    return new UserEntity({
      user_id: props.user_id,
      user_name: props.user_name,
      password: hashPassword,
      level: props.level,
      input_by: props.input_by,
      input_date: props.input_date,
      deleted_by: props.deleted_by,
      deleted_date: props.deleted_date,
      edit_history: props.edit_history,
    });
  }

  static async comparePassword(rawPassword: string, hashedPassword: string) {
    return await this.hashUtil.compare(rawPassword, hashedPassword);
  }

  async updateUser(payload: UpdateUserProps, user: JwtDecoded) {
    this.props.level = new UserLevel(payload.level);
    this.props.user_name = payload.user_name;
    this.props.edit_by = user?.user_id;
  }
}
