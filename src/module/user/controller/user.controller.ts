import { Controller, Param } from '@nestjs/common';
import { GetPaginationDto } from 'src/core/base/http/get-pagination.dto.base';
import { JwtDecoded } from 'src/core/base/module/use-case.base';
import { AuthUser } from 'src/core/decorator/auth-user.decorator';
import { SecureDelete } from 'src/core/decorator/secure-delete.decorator';
import { SecureGet } from 'src/core/decorator/secure-get.decorator';
import { SecurePost } from 'src/core/decorator/secure-post.decorator';
import { SecurePut } from 'src/core/decorator/secure-put.decorator';

import { CreateUser } from '../use-case/create-user.use-case';
import { DeleteUser } from '../use-case/delete-user.use-case';
import { GetUser } from '../use-case/get-user.use-case';
import { UpdateUser } from '../use-case/update-user.use-case';

import { CreateUserRequestDto } from './dtos/create-user.request.dto';
import { UpdateUserRequestDto } from './dtos/update-user.request.dto';
import { ZodBody } from 'src/core/decorator/zod-body.decorator';
import { ZodQuery } from 'src/core/decorator/zod-query.decorator';
import {
  CreateUserRequestProps,
  UpdateUserRequestProps,
} from '../contract/user.request.contract';
import { GetPaginationProps } from 'src/core/contract/get-pagination.request.contract';

@Controller('v1/users')
export class UsersController {
  constructor(
    private readonly deleteUser: DeleteUser,
    private readonly updateUser: UpdateUser,
    private readonly getUser: GetUser,
    private readonly createUser: CreateUser,
  ) {}

  @SecurePost()
  async createUserHandler(
    @ZodBody(CreateUserRequestDto) body: CreateUserRequestProps,
    @AuthUser() user: JwtDecoded,
  ) {
    return await this.createUser.execute({ data: body, user });
  }

  @SecureGet()
  async getUserHandler(@ZodQuery(GetPaginationDto) query: GetPaginationProps) {
    return this.getUser.execute({ data: query });
  }

  @SecureDelete(':_id')
  async deleteUserHandler(@Param('_id') _id: string) {
    return this.deleteUser.execute({ _id });
  }

  @SecurePut(':_id')
  update(
    @ZodBody(UpdateUserRequestDto)
    body: UpdateUserRequestProps,
    @Param('_id') _id: string,
    @AuthUser() user: JwtDecoded,
  ) {
    return this.updateUser.execute({ _id, data: body, user });
  }
}
