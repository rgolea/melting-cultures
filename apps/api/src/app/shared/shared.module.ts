import { Module } from '@nestjs/common';
import { SessionService } from './session/session.service';
import { LoaderService } from "./loader";

@Module({
  providers: [
    SessionService,
    LoaderService
  ],
  exports: [
    SessionService,
    LoaderService
  ]
})
export class SharedModule {}
