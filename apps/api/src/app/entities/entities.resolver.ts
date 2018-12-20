import { Resolver, Mutation, Args, Context, ResolveProperty, Query } from '@nestjs/graphql';
import { QueryService } from '../shared/query/query.service';
import { EntityCollection, EntityInterface } from './entity.interface';
import { SessionService, Payload } from '../shared/session/session.service';
import { toGlobalID } from '../shared/transform';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles, RolesGuard } from '../shared/roles';
import { Validate, ValidationGuard } from '../shared/validation';
import { UseGuards, HttpService } from '@nestjs/common';
import { ChannelCollection, ChannelInterface } from '../channels/channel.interface';
import { Ip } from '../shared/decorators';
import { environment } from '../../environments/environment';

@UseGuards(RolesGuard, ValidationGuard)
@Resolver('Entity')
export class EntitiesResolver {
  constructor(
    @InjectModel(EntityCollection) private readonly entityModel: Model<EntityInterface>,
    private readonly queryService: QueryService,
    private readonly sessionService: SessionService,
    @InjectModel(ChannelCollection) private readonly channelModel: Model<ChannelInterface>,
    private readonly httpService: HttpService
  ) {}

  @ResolveProperty()
  id(entity: EntityInterface) {
    return toGlobalID(entity._id, EntityCollection);
  }

  @ResolveProperty()
  location({ location }) {
    if (!location) return {};
    return {
      lng: location[0],
      lat: location[1]
    };
  }

  @Query()
  async entities(@Args() args, @Context('loader') loader, @Ip() ip) {
    if (ip && !args.near) {
      const res = await this.httpService
        .get<{ longitude: number; latitude: number }>(`http://api.ipstack.com/${ip}`, {
          params: {
            access_key: environment.IPSTACK_ACCESSKEY,
            format: 1,
            fields: 'latitude,longitude'
          }
        })
        .toPromise();

      const { latitude: lat, longitude: lng } = res.data;
      args.near = {
        lat,
        lng
      };
    }

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
  async addEntity(
    @Args() obj: EntityInterface | { location?: { lng: number; lat: number } },
    @Ip() ip
  ) {
    if (ip && !location) {
      const res = await this.httpService
        .get<{ longitude: number; latitude: number }>(`http://api.ipstack.com/${ip}`, {
          params: {
            access_key: environment.IPSTACK_ACCESSKEY,
            format: 1,
            fields: 'latitude,longitude'
          }
        })
        .toPromise();

      const { latitude: lat, longitude: lng } = res.data;
      obj.location = {
        lat,
        lng
      };
    }

    if (obj.location) {
      (obj.location as [number, number]) = [obj.location['lng'], obj.location['lat']];
    }

    const model = new this.entityModel(obj);
    const res = await model.save();
    return res;
  }

  @Roles('entity')
  @Validate({
    entity: async (_$, obj: EntityInterface, { loader, user }: { loader: any; user: Payload }) => {
      const entity: EntityInterface = await loader.load(obj.id);
      return toGlobalID(entity._id, EntityCollection) === user.id;
    }
  })
  @Mutation()
  async updateEntity(
    @Args() obj: EntityInterface & { location?: { lng: number; lat: number } },
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
    const entity: EntityInterface = await loader.load(obj.id);
    Object.assign(entity, obj);
    return await entity.save();
  }

  @Roles('entity')
  @Validate({
    entity: (_$, { id }: { id: string }, { user }: { user: Payload }) => id === user.id
  })
  @Mutation()
  async deleteEntity(@Args('id') id: string, @Context('loader') loader) {
    const entity: EntityInterface = await loader.load(id);
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
