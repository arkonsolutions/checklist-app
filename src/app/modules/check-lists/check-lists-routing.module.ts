import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';

export const listRoute = {
  pathMatch: 'full',
  component: ListPageComponent,
};

const routes: Routes = [
  {
    ...listRoute,
    path: ''
  },
  // {
  //   path: 'details/:checkListItemId',
  //   pathMatch: 'full',
  //   component: DetailsComponent
  // },
  // {
  //   path: 'add',
  //   pathMatch: 'full',
  //   loadChildren: () => import('./pages/add-page/add-page.module').then(m => m.AddPageModule)
  // },
  {
    ...listRoute,
    path: ':id',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckListsRoutingModule {}
