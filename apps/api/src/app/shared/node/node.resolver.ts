import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Payload } from '../session/session.service';

@Resolver('Node')
export class NodeResolver {
  constructor() {}

  @Query()
  async node(@Args('id') id: string, @Context('loader') loader) {
    return await loader.load(id);
  }

  @Query()
  async nodes(@Args('ids') ids: string[], @Context('loader') loader) {
    return await loader.loadMany(ids);
  }

  @Query()
  async viewer(@Context() { user, loader }: { user: Payload; loader: any }) {
    if (!user.id) return Promise.resolve(null);
    return await loader.load(user.id);
  }
}
