import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { ChecklistServicesModule } from './modules/check-list-services/check-list-services.module';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataBaseServiceModule } from './modules/data-base-service/data-base-service.module';
import { DataBaseService } from './modules/data-base-service/data-base.service';

import * as appState from './store/app.state';
import * as appReducer from './store/app.reducers';
import * as routerState from './store/router.state';
import { CustomRouteSerializer } from './services/router-serializer.service';
import { AppEffects } from './store/app.effects';

import { AuthService } from './modules/auth-store/services/auth.service';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { AuthStoreModule } from './modules/auth-store/auth-store.module';
import { SyncStoreModule } from './modules/sync-store/sync-store.module';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { SettingsStoreModule } from './modules/settings-store/settings-store.module';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/shared/utils/create-translate-loader';
import * as appActions from './store/app.actions';
import { MigrationService } from './services/migration.service';
import { Downloader } from '@ionic-native/downloader/ngx';

const appInitFactory = (dbService: DataBaseService, platform: Platform, auth: AuthService, store: Store, migrationService: MigrationService, translateService: TranslateService) => {
  const res = () => { 
    return platform.ready()
      .then(() => dbService.initialize())
      .then(() => migrationService.migrateToVersion(environment.appVersion))
      .then(() => {
        return new Promise((resolve: any) => {
          let userPrefferedLocale = Intl.DateTimeFormat().resolvedOptions().locale.toString();
          if (userPrefferedLocale.startsWith('ru')) {
            translateService.setDefaultLang('ru-RU');
          } else {
            translateService.setDefaultLang('en-US');
          }
          
          return translateService.use(userPrefferedLocale).subscribe((res) => {
            store.dispatch(appActions.discoveredPreferredLanguage({lng: userPrefferedLocale}));
          }, err => {
            store.dispatch(appActions.discoveredPreferredLanguage({lng: 'en-US'}));
          }, () => {
            resolve(null);
          });

        });
      }).then(() => {
        store.dispatch(appActions.setAppVersion({appVersion: environment.appVersion}));
        store.dispatch(appActions.appInitialized());
      })
  };
  return res;
};
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    DataBaseServiceModule.forRoot(),
    ChecklistServicesModule,
    StoreModule.forRoot({
      [appState.featureKey]: appReducer.reducer,
      [routerState.featureKey]: routerReducer,
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouteSerializer,
    }),
    AuthStoreModule,
    SyncStoreModule,
    SettingsStoreModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      deps: [DataBaseService, Platform, AuthService, Store, MigrationService, TranslateService],
      useFactory: appInitFactory,
      multi: true,
    },
    GooglePlus,
    SocialSharing,
    FileChooser,
    Downloader
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
