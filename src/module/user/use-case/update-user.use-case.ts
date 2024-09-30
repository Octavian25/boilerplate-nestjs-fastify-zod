import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectUserRepository } from '../repository/user.repository.provider';

import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { ResponseDto } from 'src/core/base/http/response.dto.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';
import { UserRepositoryPort } from 'src/module/user/repository/user.repository.port';
import { UpdateUserRequestProps } from '../contract/user.request.contract';

type TUpdateUserPayload = PickUseCasePayload<
  UpdateUserRequestProps,
  'data' | '_id' | 'user'
>;
type TUpdateUserResponse = ResponseDto;
@Injectable()
export class UpdateUser extends BaseUseCase<
  TUpdateUserPayload,
  TUpdateUserResponse
> {
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
  ) {
    super();
  }

  async execute({ data, _id, user }: TUpdateUserPayload) {
    try {
      const userEntity = await this.userRepository.findById(
        new ObjectIdVO(_id).valueConverted,
      );
      if (!userEntity) throw new NotFoundException('User not found.');

      userEntity.updateUser(data, user);

      await this.userRepository.updateOne(
        { _id: userEntity.propsCopy._id },
        userEntity,
      );
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, 500);
    }
    return new ResponseDto({
      status: HttpStatus.OK,
      message: `User ${_id} documents updated`,
    });
  }
}
