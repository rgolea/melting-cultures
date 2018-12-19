import { Module } from '@nestjs/common';
import { ChannelsResolver } from './channels.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelCollection } from './channel.interface';
import { ChannelSchema } from './channel.schema';
import { QueryService } from '../shared/query/query.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChannelCollection, schema: ChannelSchema }
    ])
  ],
  providers: [ChannelsResolver, QueryService]
})
export class ChannelsModule {}
