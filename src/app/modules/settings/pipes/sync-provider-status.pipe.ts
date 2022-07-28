import { Pipe, PipeTransform } from '@angular/core';
import { ISyncProviderStatus } from '../../sync-store/sync.state';

@Pipe({
  name: 'syncProviderStatus'
})
export class SyncProviderStatusPipe implements PipeTransform {

  transform(value: ISyncProviderStatus, ...args: unknown[]): unknown {
    return !!value ? `[${value.date}]: ${value.message}` : null;
  }

}
