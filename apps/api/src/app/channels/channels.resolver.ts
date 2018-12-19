import { Resolver, Subscription, Mutation, Query } from "@nestjs/graphql";
import { QueryService } from "../shared/query/query.service";
import { ChannelCollection, Channel } from "./channel.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Resolver('Channel')
export class ChannelsResolver {

  constructor(
    @InjectModel(ChannelCollection) private readonly channelModel: Model<Channel>,
    private readonly queryService: QueryService
  ){}

  @Query()
  async channels(_$, args, { loader }){
    return await this.queryService.query(ChannelCollection, args, loader);
  }

  @Query()
  async channel(_$, { id }: { id: string}, { loader }){
    return await loader.load(id);
  }

  @Mutation()
  async addChannel(_$, obj:Channel){
    const model = new this.channelModel(obj);
    return await model.save();
  }


}
