import { Resolver, Mutation, Args, Context, ResolveProperty, Query } from '@nestjs/graphql';
import { QueryService } from '../shared/query/query.service';
import { EntityCollection, Entity } from './entity.interface';
import { SessionService, Payload } from '../shared/session/session.service';
import { toGlobalID } from '../shared/transform';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles, RolesGuard } from '../shared/roles';
import { Validate, ValidationGuard } from '../shared/validation';
import { UseGuards } from '@nestjs/common';
import { ChannelCollection, Channel } from '../channels/channel.interface';

@UseGuards(RolesGuard, ValidationGuard)
@Resolver('Entity')
export class EntitiesResolver {
  constructor(
    @InjectModel(EntityCollection) private readonly entityModel: Model<Entity>,
    private readonly queryService: QueryService,
    private readonly sessionService: SessionService,
    @InjectModel(ChannelCollection) private readonly channelModel: Model<Channel>
  ) {}

  @ResolveProperty()
  id(entity: Entity) {
    return toGlobalID(entity._id, EntityCollection);
  }

  @Query()
  async entities(@Args() args, @Context('loader') loader) {
    //TODO: Implement geolocation if no location is passed
    /* if(!args.near){
     *   const location: { lng: string, lat: string } = (result of query to DNS);
     *
     *   args.near = location;
     * }
     */

    if (args.near) {
      args.location = {
        $near: [args.near.lng, args.near.lat],
        $maxDistance: 100 / 111.2 //(km/degrees)
      };
      delete args.near;
    }

    return await this.queryService.query(EntityCollection, args, loader);
  }

  @Query()
  async entity(@Args('id') id: string, @Context('loader') loader) {
    return await loader.load(id);
  }

  @Mutation()
  async addEntity(@Args() obj: Entity & { location?: { lng: number; lat: number } }) {
    /*
     * TODO: Implement geolocation if no location is passed
     *
     * if(!obj.location){
     *   const location: { lng: string, lat: string } = (result of query to DNS);
     *
     *   args.location = location;
     * }
     */
    if (obj.location) {
      (obj.location as [number, number]) = [obj.location['lng'], obj.location['lat']];
    }

    const model = new this.entityModel(obj);
    return await model.save();
  }

  @Roles('entity')
  @Validate({
    entity: async (_$, obj: Entity, { loader, user }: { loader: any; user: Payload }) => {
      const entity: Entity = await loader.load(obj.id);
      return toGlobalID(entity._id, EntityCollection) === user.id;
    }
  })
  @Mutation()
  async updateEntity(
    @Args() obj: Entity & { location?: { lng: number; lat: number } },
    @Context('loader') loader
  ) {
    /*
     * TODO: Implement geolocation if no location is passed
     *
     * if(!obj.location){
     *   const location: { lng: string, lat: string } = (result of query to DNS);
     *
     *   args.location = location;
     * }
     */
    if (obj.location) {
      (obj.location as [number, number]) = [obj.location['lng'], obj.location['lat']];
    }
    const entity: Entity = await loader.load(obj.id);
    Object.assign(entity, obj);
    return await entity.save();
  }

  @Roles('entity')
  @Validate({
    entity: (_$, { id }: { id: string }, { user }: { user: Payload }) => id === user.id
  })
  @Mutation()
  async deleteEntity(@Args('id') id: string, @Context('loader') loader) {
    const entity: Entity = await loader.load(id);
    return !!(await Promise.all([
      entity.remove(),
      this.channelModel.deleteMany({
        entityId: id
      })
    ]));
  }

  @Mutation()
  async loginEntity(
    @Args() { email, password }: { email: string; password: string },
    @Context() context
  ) {
    const user = await this.queryService.allowLogin(EntityCollection, {
      email,
      password
    });

    const token = await this.sessionService.sign({
      id: toGlobalID(user._id, EntityCollection),
      role: 'entity'
    });

    context.user = await this.sessionService.verify(token);

    return {
      sid: token,
      uid: toGlobalID(user._id, EntityCollection),
      node: user
    };
  }
}
