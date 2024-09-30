import * as z from 'zod';
import { LoginUserRequestProps } from '../../contract/auth.request.contract';

export const LoginRequestDto = z.object({
  user_id: z.string(),
  password: z.string(),
}) satisfies z.ZodType<LoginUserRequestProps>;
