import { ReflectMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLES } from '../roles';

export type ResolverFn = (
  obj?,
  args?,
  ctx?,
  other?,
) => Promise<boolean> | Observable<boolean> | boolean;

export type ValidationCondition = {
  [K in ROLES]: ResolverFn
}

export const Validate = (conditions: ValidationCondition) =>
  ReflectMetadata('validate', conditions);
