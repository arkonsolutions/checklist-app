import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncProviderService } from './services/sync-provider.service';
import { GoogleTasksSyncProviderService } from './services/google-tasks-sync-provider.service';
import { GoogleDriveSyncProviderService } from './services/google-dirve-sync-provider.service';
import { StoreModule } from '@ngrx/store';
import { featureKey } from './sync.state';
import { syncReducer } from './sync.reducers';
import { EffectsModule } from '@ngrx/effects';
import { SyncEffects } from './sync.effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SyncProviderAPIInterceptor } from './interceptors/sync-provider-api.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(featureKey, syncReducer),
    EffectsModule.forFeature([SyncEffects])
  ],
  providers: [
    {provide: SyncProviderService, useClass: GoogleTasksSyncProviderService, multi: true},
    {provide: SyncProviderService, useClass: GoogleDriveSyncProviderService, multi: true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SyncProviderAPIInterceptor,
      multi: true
    }
  ]
})
export class SyncStoreModule { }