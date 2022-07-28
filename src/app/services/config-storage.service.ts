import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigStorageService {
  store<T>(storeKey: string, value: T): Observable<any> {
    localStorage.setItem(storeKey, JSON.stringify(value));
    return EMPTY;
  }

  restore<T>(storeKey: string): Observable<T> {
    const config = JSON.parse(localStorage.getItem(storeKey));
    return of(config as T);
  }
}
