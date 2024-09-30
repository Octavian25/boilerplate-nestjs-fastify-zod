import { RegisterUserRequestDto } from 'src/module/auth/controller/dto/register-user-request.dto';
import * as z from 'zod';
import { CreateUserRequestProps } from '../../contract/user.request.contract';

export const CreateUserRequestDto = RegisterUserRequestDto.extend({
  level: z.string(),
}) satisfies z.ZodType<CreateUserRequestProps>;
