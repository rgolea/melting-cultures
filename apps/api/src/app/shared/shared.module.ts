import { Module } from '@nestjs/common';
import { SessionService } from './session/session.service';
import { LoaderService } from "./loader";
import { QueryService } from './query/query.service';

@Module({
  providers: [
    SessionService,
    LoaderService,
    QueryService
  ],
  exports: [
    SessionService,
    LoaderService,
    QueryService
  ]
})
export class SharedModule {}
