import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleDriveSettingsPageComponent } from './pages/google-drive-settings-page/google-drive-settings-page.component';

const routes: Routes = [{
  path: '',
  component: GoogleDriveSettingsPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleDriveSettingsRoutingModule { }
