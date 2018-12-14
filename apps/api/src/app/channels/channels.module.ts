import { Module } from '@nestjs/common';
import { ChannelsResolver } from './channels.resolver';

@Module({
  providers: [ ChannelsResolver ]
})
export class ChannelsModule{}
