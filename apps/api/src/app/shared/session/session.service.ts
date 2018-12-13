import { Injectable } from '@nestjs/common';
import { verify, sign } from 'jsonwebtoken';

export type Payload = {
  id: string;
  role: string;
};

@Injectable()
export class SessionService {
  private TOKEN: string = 'token';

  constructor() {}

  verify(token: string): Promise<Payload> {
    return new Promise(resolve => {
      verify(token, this.TOKEN, (err, payload: Payload) => {
        if (err) return resolve();
        resolve(payload);
      });
    });
  }

  async sign(payload: Payload): Promise<string> {
    return await sign(payload, this.TOKEN, {
      expiresIn: '30d'
    });
  }
}
