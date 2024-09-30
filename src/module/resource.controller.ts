import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { Public } from 'src/core/decorator/public.decorator';

@Controller('resources')
export class ResourceController {
  constructor() {}

  @Public()
  @Get('status')
  getHello(): ResponseDto {
    return new ResponseDto({
      status: HttpStatus.OK,
      message: 'Status Alive.',
    });
  }
}
