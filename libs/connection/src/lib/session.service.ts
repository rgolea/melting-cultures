import { Injectable } from '@angular/core';
import { NgForage } from 'ngforage';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public sessionToken$ = new Subject<string>();
  private readonly sessionKey = 'session:meco';

  private sessionToken: string = null;

  constructor(private readonly ngf: NgForage) {
    this.ngf
      .getItem<string>(this.sessionKey)
      .then(token => this.setSessionToken(token))
      .catch(err => console.error(err));
  }

  get isAnonymous() {
    return !this.sessionToken;
  }

  async getSessionToken() {
    if (this.isAnonymous) {
      this.sessionToken = await this.ngf.getItem<string>(this.sessionKey);
      this.setSessionToken(this.sessionToken);
    }

    return this.sessionToken;
  }

  setSessionToken(token: string) {
    this.sessionToken = token || '';
    this.sessionToken$.next(this.sessionToken);
    return this.ngf.setItem<string>(this.sessionKey, token);
  }
}
