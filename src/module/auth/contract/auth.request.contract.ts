export interface AuthRefreshTokenRequestProps {
  user_id: string;
  refresh_token: string;
}
export interface LoginUserRequestProps {
  user_id: string;
  password: string;
}
export interface RegisterUserRequestProps {
  user_id: string;
  user_name: string;
  password: string;
}
