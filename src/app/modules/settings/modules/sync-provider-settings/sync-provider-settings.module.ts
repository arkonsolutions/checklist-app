import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyncProviderSettingsRoutingModule } from './sync-provider-settings-routing.module';
import { SyncProviderSettingsPageComponent } from './pages/sync-provider-settings-page/sync-provider-settings-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [SyncProviderSettingsPageComponent],
  imports: [
    CommonModule,
    IonicModule,
    SyncProviderSettingsRoutingModule,
  ]
})
export class SyncProviderSettingsModule { }
