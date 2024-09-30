export interface UpdateUserRequestProps {
  user_name: string;
  level: string;
}
export interface CreateUserRequestProps {
  level?: string;
  user_id: string;
  user_name: string;
  password: string;
}
