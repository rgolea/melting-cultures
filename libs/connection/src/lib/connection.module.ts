import { NgModule, InjectionToken, ModuleWithProviders, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, Apollo } from 'apollo-angular';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SessionService } from './session.service';
import { setContext } from 'apollo-link-context';

export const API_URL = new InjectionToken('API_URL');

@NgModule({
  imports: [CommonModule, ApolloModule],
  exports: [ApolloModule],
  providers: [SessionService]
})
export class ConnectionModule {
  static forRoot(config: { apiUrl: string }): ModuleWithProviders {
    return {
      ngModule: ConnectionModule,
      providers: [{ provide: API_URL, useValue: config.apiUrl || '' }]
    };
  }

  constructor(
    @Inject(API_URL) readonly url: string,
    readonly apollo: Apollo,
    readonly sessionService: SessionService
  ) {
    const link = new BatchHttpLink({
      uri: url
    });
    const authMiddleware = setContext(async (_$, { headers }) => {
      const token = await sessionService.getSessionToken();
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token || ''}`
        }
      };
    });

    apollo.create({
      link: createPersistedQueryLink()
        .concat(authMiddleware)
        .concat(link),
      cache: new InMemoryCache(),
      queryDeduplication: true,
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-first',
          errorPolicy: 'all'
        },
        query: {
          fetchPolicy: 'cache-first',
          errorPolicy: 'all'
        }
      }
    });
  }
}
