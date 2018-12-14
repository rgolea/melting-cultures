import { encode, decode } from '../base64';
import * as _ from 'underscore';

type GlobalID = string;
export interface ParsedGlobalID {
  id: string;
  name: string;
}

export const toGlobalID = (id: string, name: string): GlobalID => {
  return encode(`${name}:${id}`);
};

export const fromGlobalID = (id: GlobalID): ParsedGlobalID => {
  const str = decode(id);
  let parts = str.split(':');
  return {
    id: _.last(parts),
    name: _.first(parts),
  };
};
