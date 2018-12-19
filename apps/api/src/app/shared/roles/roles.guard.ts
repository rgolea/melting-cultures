import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<ROLES[]>('roles', context.getHandler());
    if (!roles || !roles.length) return true;
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext()
      ? ctx.getContext().user
      : context.switchToHttp().getRequest().user;
    return user && user.role && roles.some(role => role === user.role);
  }
}
