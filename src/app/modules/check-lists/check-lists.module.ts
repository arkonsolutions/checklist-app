import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckListsRoutingModule } from './check-lists-routing.module';
import { ChecklistServicesModule } from '../check-list-services/check-list-services.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CheckListEffects } from './store/check-lists.effects';
import { checklistReducer } from './store/check-lists.reducer';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ChecklistFormComponent } from './components/checklist-form/checklist-form.component';
import { ChecklistFormModalComponent } from './components/checklist-form-modal/checklist-form-modal.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/shared/utils/create-translate-loader';

@NgModule({
  declarations: [
    ListPageComponent,
    ChecklistFormComponent,
    ChecklistFormModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CheckListsRoutingModule,
    ChecklistServicesModule,
    StoreModule.forFeature('checkList', checklistReducer),
    EffectsModule.forFeature([CheckListEffects]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class CheckListsModule {}
