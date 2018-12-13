import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from "./app/app.module";
import { environment } from './environments/environment';
import { SharedModule } from './app/shared/shared.module';
import { SessionService } from './app/shared/session/session.service';
import { TokenMiddleware } from './app/shared/token/token.middleware';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  const sessionService = app.select(SharedModule).get(SessionService);
  const tokenMiddleware = new TokenMiddleware(sessionService);

  app.use(tokenMiddleware.resolve());
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
