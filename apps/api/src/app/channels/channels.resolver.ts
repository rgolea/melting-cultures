import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";
import { QueryService } from "../shared/query/query.service";
import { ChannelCollection, Channel } from "./channel.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UseGuards } from "@nestjs/common";
import { RolesGuard, Roles } from "../shared/roles";
import { ValidationGuard, Validate } from "../shared/validation";
import { Payload } from '../shared/session/session.service';

@UseGuards(RolesGuard, ValidationGuard)
@Resolver('Channel')
export class ChannelsResolver {

  constructor(
    @InjectModel(ChannelCollection) private readonly channelModel: Model<Channel>,
    private readonly queryService: QueryService
  ){}

  @Query()
  async channels(@Args() args, @Context('loader') loader){
    return await this.queryService.query(ChannelCollection, args, loader);
  }

  @Query()
  async channel(@Args('id') id: string, @Context('loader') loader){
    return await loader.load(id);
  }

  @Roles('entity')
  @Validate({
    entity: (_$, obj: Channel, { user }: { user: Payload }) => !!(obj.entityId = user.id)
  })
  @Mutation()
  async addChannel(@Args() obj:Channel){
    const model = new this.channelModel(obj);
    return await model.save();
  }

  @Roles('entity')
  @Validate({
    entity: async (_$, obj: Channel, { user, loader }: { user: Payload, loader: any }) => {
      const channel:Channel = await loader.load(obj.id);
      return channel.entityId === user.id;
    }
  })
  @Mutation()
  async updateChannel(@Args() obj: Channel, @Context('loader') loader){
    const channel: Channel = await loader.load(obj.id);
    Object.assign(channel, obj);
    return await channel.save();
  }

  @Roles('entity')
  @Validate({
    entity: async (_$, { id }: { id: string }, { user, loader }: { user: Payload, loader: any }) => {
      const channel:Channel = await loader.load(id);
      return channel.entityId === user.id;
    }
  })
  @Mutation()
  async deleteChannel(@Args('id') id: string, @Context('loader') loader){
    const channel:Channel = await loader.load(id);
    return !!(channel.remove());
  }
}
