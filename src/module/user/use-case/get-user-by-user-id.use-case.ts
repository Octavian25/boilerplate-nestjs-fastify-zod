import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, JwtDecoded } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { UserRepositoryPort } from 'src/module/user/repository/user.repository.port';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserMapper } from '../domain/user.mapper';
import { UserResponseProps } from '../contract/user.response.contract';

export type TGetUserPayload = PickUseCasePayload<JwtDecoded, 'data'>;
export type TGetUserResponse = ResponseDto<UserResponseProps>;
@Injectable()
export class GetUserByUserId extends BaseUseCase<
  TGetUserPayload,
  TGetUserResponse
> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
  ) {
    super();
  }
  async execute({ data }: TGetUserPayload) {
    const user = await this.userRepository.findOneOrThrow({
      level: { $ne: 'SU' },
      user_id: data.user_id,
    });

    return new ResponseDto({
      status: HttpStatus.OK,
      data: UserMapper.toPlainObject(user),
    });
  }
}
