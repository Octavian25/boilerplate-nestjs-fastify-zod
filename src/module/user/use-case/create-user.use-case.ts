import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';

import { EnvService } from 'src/infra/config/env.service';
import { UserRepositoryPort } from '../repository/user.repository.port';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserEntity } from '../domain/user.entity';
import { UserLevel } from '../domain/value-objects/user-level.value-object';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { SHA256 } from 'crypto-js';
import { OptionalSecretKeyProps } from 'src/core/contract/optional-secret-key.request.contract';
import { CreateUserRequestProps } from '../contract/user.request.contract';
import { IRepositoryResponse } from 'src/core/interface/repository-response.interface';
type TCreateUserPayload = PickUseCasePayload<
  CreateUserRequestProps & OptionalSecretKeyProps,
  'data' | 'user'
>;
type TCreateUserResponse = ResponseDto<IRepositoryResponse>;

@Injectable()
export class CreateUser extends BaseUseCase<
  TCreateUserPayload,
  TCreateUserResponse
> {
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
    private envService: EnvService,
  ) {
    super();
  }

  public async execute({ data, user }: TCreateUserPayload) {
    await this.userRepository.findOneAndThrow({ user_id: data.user_id });

    const isSecretKeyValid = await this._validateSecretKey(data.secretKey);
    const level = await this._generateUserLevel(isSecretKeyValid, data?.level);

    try {
      const userEntity = await UserEntity.create({
        user_name: data.user_name,
        user_id: data.user_id,
        password: data.password,
        level: level,
        input_by: user?.user_id ?? 'SYSTEM',
        input_date: new Date(),
      });

      const result = await this.userRepository.save(userEntity);

      return new ResponseDto({ status: HttpStatus.CREATED, data: result });
    } catch (err) {
      this.logger.error(err);

      throw new HttpException(
        { message: err.message || err },
        err.message.includes('exists')
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async _validateSecretKey(secretKey?: string): Promise<boolean> {
    const systemSecretKey = SHA256(
      this.envService.variables.secretKey,
    ).toString();
    const isSecretKeyValid = secretKey && secretKey === systemSecretKey;

    if (secretKey && !isSecretKeyValid)
      throw new BadRequestException('Wrong Key Input. Transaction aborted.');

    return isSecretKeyValid || false;
  }

  private async _generateUserLevel(isSecretKeyValid: boolean, level?: string) {
    if (isSecretKeyValid)
      await this.userRepository.findOneAndThrow(
        { level: 'SU' },
        'Level System Sudah Terdaftar.',
      );
    return isSecretKeyValid ? new UserLevel('SU') : new UserLevel(level!);
  }
}
