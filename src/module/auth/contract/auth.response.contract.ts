export interface LoginUserResponseProps {
  user_id: string;
  access_token: string;
  refresh_token: string;
  level: string;
  user_name: string;
}

export interface RefreshTokenResponseProps {
  access_token: string;
  refresh_token: string;
}
