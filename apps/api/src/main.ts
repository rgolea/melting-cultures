import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from "./app/app.module";
import { environment } from './environments/environment';
import { SharedModule } from './app/shared/shared.module';
import { SessionService } from './app/shared/session/session.service';
import { TokenMiddleware } from './app/shared/token/token.middleware';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ContextMiddleware } from './app/shared/context/context.middleware';
import { LoaderService } from './app/shared/loader';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  const sessionService = app.select(SharedModule).get(SessionService);
  const tokenMiddleware = new TokenMiddleware(sessionService);

  const loaderService = app.select(SharedModule).get(LoaderService);
  const contextMiddleware = new ContextMiddleware(loaderService);

  app.use(tokenMiddleware.resolve());
  app.use(contextMiddleware.resolve());
  if(environment.production){
    app.use(helmet());
    app.use(
      rateLimit({
        windowMs: 5 * 60 * 1000, //5 minutes
        max: 100
      }),
    );
  }

  await app.listen(environment.port);
}
bootstrap();
