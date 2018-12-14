import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { SessionService } from '../session/session.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly sessionService: SessionService
  ) {}
  resolve(): MiddlewareFunction {
    return async (req: Request, _$, next) => {
      req['user'] = {
        role: 'public',
        id: null
      };
      const authorization: string = req.headers['authorization'] as string;
      const token = authorization ? authorization.split(' ')[1] : null;
      if (!token) return next();
      let payload = await this.sessionService.verify(token);
      req['user'] = payload || req['user'];
      next();
    };
  }
}
