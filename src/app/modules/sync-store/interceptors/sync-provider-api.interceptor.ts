import { Inject, Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-store/services/auth.service';
import { SyncProviderService } from '../services/sync-provider.service';

@Injectable()
export class SyncProviderAPIInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(SyncProviderService) private providersServices: SyncProviderService<any>[]
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.auth.identity.length > 0) {
      let syncProvider = this.providersServices.find(ps => (!!ps.baseURI && ps.baseURI.length > 0) ? request.url.startsWith(ps.baseURI) : false);
      if (!!syncProvider) {
        let identity = this.auth.identity.find(id => id.provider === syncProvider.requiredAuthProviderKey);
        if (!!identity) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${identity.accessToken}`
            }
          });
        }
      }
    }

    return next.handle(request);
  }
}
