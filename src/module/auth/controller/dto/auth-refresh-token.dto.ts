import * as z from 'zod';
import { AuthRefreshTokenRequestProps } from '../../contract/auth.request.contract';

export const AuthRefreshTokenRequestDto = z.object({
  user_id: z.string(),
  refresh_token: z.string(),
}) satisfies z.ZodType<AuthRefreshTokenRequestProps>;
