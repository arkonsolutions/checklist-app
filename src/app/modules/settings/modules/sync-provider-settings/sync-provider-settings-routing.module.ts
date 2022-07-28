import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SyncProviderSettingsPageComponent } from './pages/sync-provider-settings-page/sync-provider-settings-page.component';

const routes: Routes = [{
  path: '',
  component: SyncProviderSettingsPageComponent,
  children: [
    {
      path: 'google-tasks',
      loadChildren: () => import('./modules/google-tasks-settings/google-tasks-settings.module').then(m => m.GoogleTasksSettingsModule)
    },
    {
      path: 'google-drive',
      loadChildren: () => import('./modules/google-drive-settings/google-drive-settings.module').then(m => m.GoogleDriveSettingsModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyncProviderSettingsRoutingModule { }