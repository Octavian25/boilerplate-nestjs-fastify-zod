import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { UserRepositoryPort } from 'src/module/user/repository/user.repository.port';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserMapper } from '../domain/user.mapper';
import { UserResponseProps } from '../contract/user.response.contract';
import { GetPaginationProps } from 'src/core/contract/get-pagination.request.contract';

export type TGetUserPayload = PickUseCasePayload<GetPaginationProps, 'data'>;
export type TGetUserResponse = ResponseDto<UserResponseProps[]>;
@Injectable()
export class GetUser extends BaseUseCase<TGetUserPayload, TGetUserResponse> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
  ) {
    super();
  }
  async execute({ data }: TGetUserPayload) {
    const users = await this.userRepository.findByPaginateSorted(
      { level: { $ne: 'SU' } },
      { skip: Number(data.skip), limit: Number(data.limit) },
      data.sort_by || { _id: 1 },
    );

    const usersMapped: UserResponseProps[] = users.map((user) => {
      const userObject = UserMapper.toPlainObject(user);
      return {
        _id: userObject._id,
        level: userObject.level,
        user_id: userObject.user_id,
        user_name: userObject.user_name,
        input_by: userObject.input_by,
      };
    });

    return new ResponseDto({ status: HttpStatus.OK, data: usersMapped });
  }
}
