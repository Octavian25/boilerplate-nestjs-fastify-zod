import { IEditHistory } from './edit_history.interface';

export interface IDefaultInfo {
  input_by: string;
  input_date?: Date | undefined;
  edit_history?: IEditHistory[] | undefined;
  edit_by?: string | undefined;
  deleted_by?: string | undefined;
  deleted_date?: Date | undefined;
}
