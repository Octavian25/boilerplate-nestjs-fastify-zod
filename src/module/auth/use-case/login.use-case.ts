import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';

import { EnvService } from 'src/infra/config/env.service';
import { InjectUserRepository } from 'src/module/user/repository/user.repository.provider';
import { UserEntity } from 'src/module/user/domain/user.entity';
import { UserRepositoryPort } from '../../user/repository/user.repository.port';
import { UserMapper } from 'src/module/user/domain/user.mapper';
import { LoginUserRequestProps } from '../contract/auth.request.contract';
import { LoginUserResponseProps } from '../contract/auth.response.contract';

type TLoginPayload = PickUseCasePayload<LoginUserRequestProps, 'data'>;
type TLoginResponse = ResponseDto<LoginUserResponseProps>;
@Injectable()
export class LoginUser extends BaseUseCase<TLoginPayload, TLoginResponse> {
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
    private jwtService: JwtService,
    private envService: EnvService,
  ) {
    super();
  }

  public async execute({ data }: TLoginPayload) {
    const userData = await this.userRepository.findOneOrThrow(
      {
        user_id: data.user_id,
      },
      'Username atau password salah.',
    );

    const userProps = userData.propsCopy;
    const passwordMatch = await UserEntity.comparePassword(
      data.password,
      userProps.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Username or Password is Incorrect.');
    }

    const jwtPayload = {
      sub: userProps.user_id,
    };

    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: 86400,
      secret: this.envService.variables.jwtRefreshKey,
    });

    const userObject = UserMapper.toPlainObject(userData);
    return new ResponseDto({
      status: HttpStatus.OK,
      data: {
        _id: userObject._id,
        user_id: userObject.user_id,
        access_token: accessToken,
        refresh_token: refreshToken,
        level: userObject.level,
        user_name: userObject.user_name,
      },
    });
  }
}
