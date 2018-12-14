import { Injectable } from '@nestjs/common';
import * as Dataloader from 'dataloader';
import { fromGlobalID } from '../transform';
import { model } from 'mongoose';
import * as _ from 'underscore';

@Injectable()
export class LoaderService {
  private instance = this.generate();

  getInstance() {
    return this.instance;
  }

  generate() {
    const instance = (this.instance = new Dataloader(async keys => {
      const ids = keys.map((key: string) => ({
        key,
        ...fromGlobalID(key),
      }));

      const models = _.chain(ids)
        .groupBy('name')
        .value();

      const results = _.flatten(
        await Promise.all(
          _.chain(models)
            .keys()
            .uniq()
            .map(async m => {
              const id = models[m].map(({ id }) => id);
              const collection = model(m);
              return await collection
                .find()
                .where('_id')
                .in(id)
                ['maxTime'](500);
            })
            .value(),
        ),
      );

      const resultsById = _.indexBy(results, '_id');
      return Promise.all(ids.map(key => resultsById[key.id] || {}));
    }));
    return instance;
  }
}
