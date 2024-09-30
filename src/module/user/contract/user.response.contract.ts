import { IDefaultInfo } from 'src/core/interface/default_info.interface';
import { IId } from 'src/core/interface/id.interface';

export interface UserResponseProps extends IId, IDefaultInfo {
  user_id: string;
  user_name: string;
  level: string;
}
