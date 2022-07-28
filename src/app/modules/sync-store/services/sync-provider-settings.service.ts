import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, of } from "rxjs";
import { SyncProviderKeyEnum } from "../model/sync-provider-key.enum";

export const SYNC_SETTINGS_STORAGE_KEY = 'checklist-sync';

export type SettingsDictionary = {
  [key in SyncProviderKeyEnum]: {[key: string]: string}
};

/** Обработчик настроек провайдеров синхронизации */
@Injectable({providedIn: 'root'})
export class SyncProviderSettingsService {
  private _settings$: BehaviorSubject<SettingsDictionary> = new BehaviorSubject<SettingsDictionary>({} as SettingsDictionary);
  public settings$: Observable<SettingsDictionary> = this._settings$.asObservable();

  /** Считать настройки из хранилища */
  public restore(): Observable<SettingsDictionary> {
    let stored = localStorage.getItem(SYNC_SETTINGS_STORAGE_KEY);
    this._settings$.next(JSON.parse(stored));
    return of(this._settings$.value);
  }

  /** Сохранить настройки в хранилище */
  public store(): Observable<SettingsDictionary> {
    localStorage.setItem(SYNC_SETTINGS_STORAGE_KEY, JSON.stringify(this._settings$.value));
    return of(this._settings$.value);
  }

  /** Считать значение параметра */
  public get(providerKey: SyncProviderKeyEnum, name: string): string {
    let providerDictionary = this._settings$.value[providerKey];
    return !!providerDictionary ? providerDictionary[name] : null;
  }

  /** Установить значение параметра */
  public set(providerKey: SyncProviderKeyEnum, name: string, value: string): void {
    let providerDictionary = this._settings$.value[providerKey];
    this._settings$.next({
      ...this._settings$.value,
      [providerKey]: {
        ...providerDictionary,
        [name]: value
      }
    });
  }
}