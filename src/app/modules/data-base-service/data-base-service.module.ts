import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataBaseService } from './data-base.service';
import { SqliteNativeDataBaseService } from './sqlite-native-data-base.service';
import { HttpClientModule } from '@angular/common/http';
import { SqliteCapacitorDataBaseService } from './sqlite-capacitor-data-base.service';
import { DummyDataBaseService } from './dummy-data-base.service';
import { environment } from 'src/environments/environment';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
})
export class DataBaseServiceModule {
  constructor(@Optional() @SkipSelf() parentModule?: DataBaseServiceModule) {
    if (parentModule) {
      throw new Error(
        'DataBaseServiceModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders<DataBaseServiceModule> {
    return {
      ngModule: DataBaseServiceModule,
      providers: [
        {
          provide: DataBaseService,
          useClass: !environment.useFakeDB
            ? SqliteNativeDataBaseService
            : DummyDataBaseService,
        },
        SQLitePorter
      ],
    };
  }
}
