import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { LoaderService } from '../loader';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly loaderService: LoaderService
  ) {}
  resolve(): MiddlewareFunction {
    return async (req: Request, _$, next) => {
      req['loader'] = this.loaderService.generate();
      next();
    };
  }
}
