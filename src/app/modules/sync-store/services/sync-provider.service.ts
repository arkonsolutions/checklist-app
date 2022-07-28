import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthProviderEnum } from "../../auth-store/model/auth-provider.enum";
import { SyncProviderKeyEnum } from "../model/sync-provider-key.enum";
import { SyncProviderSettingsService } from "./sync-provider-settings.service";

export abstract class SyncProviderService<T> {
  constructor(private settingsService: SyncProviderSettingsService){}
  /** Настройки провайдера  */
  protected settings$: Observable<{[key: string]: string}> = this.settingsService.settings$.pipe(
    map(data => data[this.providerKey])
  )
  /** Значение для настроек провайдера по умолчанию */
  public abstract get defaultSettings(): {[key: string]: string};
  /** Строковый идентификатор провайдера */
  public abstract get providerKey(): SyncProviderKeyEnum;
  /** Ключ провайдера аутентификации, требуемого для работы с API данного провайдера синхронизации */
  public abstract get requiredAuthProviderKey(): AuthProviderEnum;
  /** Базовая часть URI для обращения к API */
  public abstract get baseURI(): string;
  /** Обновлённые на удалённом провайдете элементы */
  public abstract providerUpdated$: Observable<T>;
  /** Отправка обновлённий элементов в удалённый провайдер */
  public abstract sendToProvider(data: T[]): Observable<any>;
  /** Проверка соединения с провайдером синхронизации */
  public abstract checkConnection(): Observable<boolean>;
  /** Остановить автономные процессы сервиса синхронизации */
  public abstract stopActivity(): Observable<boolean>;
}