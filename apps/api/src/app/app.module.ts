import {
  Module
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { environment } from '../environments/environment';
import { DeprecatedDirective } from 'graphql-directive-deprecated';
import { SharedModule } from './shared/shared.module';
import { GraphQLEmail } from "graphql-custom-types";
import { ChannelsModule } from './channels/channels.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityModule } from './entities/entities.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/meco', {
      useNewUrlParser: true,
      useCreateIndex: true
    }),
    GraphQLModule.forRoot({
      context: ({ req }) => req,
      typePaths: ['./**/*.gql'],
      debug: !environment.production,
      playground: !environment.production,
      introspection: true,
      installSubscriptionHandlers: true,
      resolvers: {
        Node: {
          __resolveType: obj => obj.ofType,
        },
        Viewer: {
          __resolveType: obj => obj.ofType,
        },
        Email: GraphQLEmail
      },
      schemaDirectives: {
        deprecated: DeprecatedDirective as any
      }
    }),
    EntityModule,
    ChannelsModule,
    SharedModule
  ]
})
export class ApplicationModule {}

