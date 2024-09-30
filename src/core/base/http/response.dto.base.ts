import { ResponseProps } from 'src/core/contract/response.contract';

export class ResponseDto<T = { [k: string]: any }> implements ResponseProps<T> {
  constructor({ status, data, message = '', count = 0 }: ResponseProps<T>) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.count = count;
  }

  status: number;

  data?: T;

  message?: string;

  count?: number;
}
