import { Injectable } from '@angular/core';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot } from '@angular/router';
import { RouterStateUrl } from '../models/router-state-url.model';

@Injectable()
export class CustomRouteSerializer
  implements RouterStateSerializer<RouterStateUrl>
{
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let result: RouterStateUrl = null;

    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;
    const hash =
      url.indexOf('#') > -1 ? url.substr(url.indexOf('#') + 1) : null;

    const {data} = route;

    result = { url, params, queryParams, hash, data };

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return result;
  }
}
