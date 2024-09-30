import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/infra/logger/logger';

export interface JwtDecoded {
  user_id?: string;
}

export interface IUseCasePayload<T> {
  _id: string;
  data: T;
  user: JwtDecoded;
}

export interface IUseCase<IReq, IRes> {
  execute(request?: IReq): IRes | Promise<IRes>;
}

@Injectable()
export abstract class BaseUseCase<IReq, IRes> implements IUseCase<IReq, IRes> {
  protected logger: CustomLogger;

  constructor() {
    this.logger = new CustomLogger(this.constructor.name);
  }

  abstract execute(request?: IReq): IRes | Promise<IRes>;
}
