import * as z from 'zod';
import { UpdateUserRequestProps } from '../../contract/user.request.contract';

export const UpdateUserRequestDto = z.object({
  user_name: z.string(),
  level: z.string(),
}) satisfies z.ZodType<UpdateUserRequestProps>;
