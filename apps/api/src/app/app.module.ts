import {
  Module
} from '@nestjs/common';
import { ChurchesModule } from './churches/churches.module';
import { GraphQLModule } from '@nestjs/graphql';
import { environment } from '../environments/environment';
import { DeprecatedDirective } from 'graphql-directive-deprecated';
import { SharedModule } from './shared/shared.module';

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
        }
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
