import { Resolver, Mutation, Args } from '@nestjs/graphql';

@Resolver('Churches')
export class ChurchesResolver {
  @Mutation()
  register(@Args('church') church) {
    return church;
  }
}
