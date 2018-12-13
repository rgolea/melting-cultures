import {
  Module
} from '@nestjs/common';
import { ChurchesModule } from './churches/churches.module';
import { GraphQLModule } from '@nestjs/graphql';
import { environment } from '../environments/environment';
import { DeprecatedDirective } from 'graphql-directive-deprecated';
import { SharedModule } from './shared/shared.module';
import { join } from 'path';
import { GraphQLEmail } from "graphql-custom-types";

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req }) => req,
      typePaths: ['./**/*.gql'],
      debug: !environment.production,
      playground: !environment.production,
      introspection: true,
      resolvers: {
        Node: {
          __resolveType: obj => obj.ofType
        },
        Email: GraphQLEmail
      },
      schemaDirectives: {
        deprecated: DeprecatedDirective as any
      }
    }),
    ChurchesModule,
    SharedModule
  ]
})
export class ApplicationModule {}
