import { Module } from '@nestjs/common';
import { resourceProviders } from './resource.provider';
import { APP_GUARD } from '@nestjs/core';
import { SignatureGuard } from 'src/core/guard/signature.guard';
import { ResourceController } from './resource.controller';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: SignatureGuard,
    },
  ],
  imports: resourceProviders,
  exports: resourceProviders,
  controllers: [ResourceController],
})
export class ResourceModule {}
