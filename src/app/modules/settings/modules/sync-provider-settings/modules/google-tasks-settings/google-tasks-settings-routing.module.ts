import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleTasksSettingsPageComponent } from './pages/google-tasks-settings-page/google-tasks-settings-page.component';

const routes: Routes = [{
  path: '',
  component: GoogleTasksSettingsPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleTasksSettingsRoutingModule { }
