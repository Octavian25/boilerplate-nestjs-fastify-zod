import { BadRequestException, Controller, Headers, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-user-request.dto';
import { LoginUser } from '../use-case/login.use-case';
import { CreateUser } from 'src/module/user/use-case/create-user.use-case';
import { RegisterUserRequestDto } from './dto/register-user-request.dto';
import { AuthRefreshTokenRequestDto } from 'src/module/auth/controller/dto/auth-refresh-token.dto';
import { RefreshToken } from '../use-case/refresh-token.use-case';
import { ZodBody } from 'src/core/decorator/zod-body.decorator';
import {
  AuthRefreshTokenRequestProps,
  LoginUserRequestProps,
  RegisterUserRequestProps,
} from '../contract/auth.request.contract';
@Controller('v1/auth')
export class AuthController {
  constructor(
    readonly loginUser: LoginUser,
    readonly createUser: CreateUser,
    readonly refreshToken: RefreshToken,
  ) {}

  @Post('register-su')
  async createUserHandler(
    @ZodBody(RegisterUserRequestDto) body: RegisterUserRequestProps,
    @Headers('secret-key') secretKey: string, // client secret key must be hashed in SHA256
  ) {
    if (!secretKey) throw new BadRequestException('Secret key is required');

    return this.createUser.execute({
      data: { ...body, secretKey },
      user: { user_id: 'SYSTEM' },
    });
  }

  @Post('login')
  async loginUserHandler(
    @ZodBody(LoginRequestDto) body: LoginUserRequestProps,
  ) {
    return this.loginUser.execute({ data: body });
  }

  @Post('refresh')
  async refreshTokenHandler(
    @ZodBody(AuthRefreshTokenRequestDto) body: AuthRefreshTokenRequestProps,
  ) {
    return this.refreshToken.execute({ data: body });
  }
}
