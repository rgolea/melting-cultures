import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { encode, decode } from '../base64';
import * as _ from 'underscore';
import { model, Document, Query } from 'mongoose';
import { toGlobalID } from '../transform';

export interface AuthenticatedUser extends Document {
  readonly comparePassword?: (password: string) => Promise<boolean>;
}

@Injectable()
export class QueryService {
  async query(collection: string, params: any = {}, loader?: any) {
    if (!params) params = {};
    let orderField = '_id';
    let order = { [orderField]: 1 };
    if (!params.first && !params.last) {
      params.first = 50;
    }

    if (params.orderBy) {
      delete order._id;
      order[params.orderBy.field] = params.orderBy.descending ? -1 : 1;
      orderField = params.orderBy.field;
    }

    if (params.before) {
      const operation = order[orderField] === -1 ? '$gt' : '$lt';
      params[orderField] = params[orderField] || {};
      params[orderField][operation] = decode(params.before);
    }

    if (params.after) {
      const operation = order[orderField] === -1 ? '$lt' : '$gt';
      params[orderField] = params[orderField] || {};
      params[orderField][operation] = decode(params.after);
    }

    const nodesQuery = model(collection)
      .find(_.omit(params, 'first', 'last', 'after', 'before', 'orderBy'))
      .sort(order);

    const countQuery = model(collection)
      .find(
        _.omit(params, 'first', 'last', 'after', 'before', 'orderBy', '_id'),
      )
      .skip(0)
      .limit(0)
      .count();

    let count = await (countQuery['maxTime'](500).exec() as Query<number>);
    let query = {
      skip: null,
      limit: null,
    };
    if (params.first || params.last) {
      if (params.first && count > params.first) {
        query.limit = params.first;
      }
    }

    if (params.last) {
      if (query.limit && query.limit > params.last) {
        query.skip = query.limit - params.last;
        query.limit = query.limit - query.skip;
      } else if (!query.limit && count > params.last) {
        query.skip = count - params.last;
      }
    }

    if (query.skip) nodesQuery.skip(query.skip);
    if (query.limit) nodesQuery.limit(query.limit);

    const nodes = (await nodesQuery['maxTime'](500).exec()) as Array<Document>;
    if (loader) {
      nodes
        .filter(node => !!node['ofType'])
        .forEach(node =>
          loader.prime(toGlobalID(node._id, node['ofType']), node),
        );
    }
    const edges = nodes.map(node => ({
      cursor: encode(node[orderField].toString()),
      node,
    }));

    let pageInfo = {
      hasNextPage: params.before
        ? true
        : Boolean(nodes.length === params.first),
      hasPreviousPage: params.after
        ? true
        : Boolean(nodes.length === params.last),
      startCursor: edges.length ? _.first(edges).cursor : null,
      endCursor: edges.length ? _.last(edges).cursor : null,
    };

    return {
      pageInfo,
      nodes,
      edges,
      totalCount: count,
    };
  }

  async allowLogin(
    m,
    credentials: {
      email: string;
      password: string;
    },
  ): Promise<AuthenticatedUser> {
    const user: AuthenticatedUser = await model(m)
      .findOne({
        email: credentials.email,
      })
      ['maxTime'](500);
    if (!user) throw new NotFoundException('User not found');
    const isMatch = user.comparePassword(credentials.password);
    if (isMatch) {
      return user;
    } else {
      throw new UnauthorizedException('Bad Credentials');
    }
  }
}
