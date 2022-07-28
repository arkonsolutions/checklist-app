import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/settings-page/settings-page.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'sync-provider',
    loadChildren: () => import('./modules/sync-provider-settings/sync-provider-settings.module').then(m => m.SyncProviderSettingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
