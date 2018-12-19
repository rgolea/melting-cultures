import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ValidationCondition } from './validation.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Payload } from '../session/session.service';

@Injectable()
export class ValidationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const conditions = this.reflector.get<ValidationCondition>(
      'validate',
      context.getHandler(),
    );

    if (!conditions || !Object.keys(conditions).length) return true;
    const ctx = GqlExecutionContext.create(context);
    const user:Payload = ctx.getContext().user;
    const condition = conditions[user.role];
    if (!condition) return true;
    return condition(
      context.getArgByIndex(0),
      context.getArgByIndex(1),
      context.getArgByIndex(2),
      context.getArgByIndex(3),
    );
  }
}
