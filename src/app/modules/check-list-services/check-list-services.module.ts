import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckListService } from './check-list.service';
import { CheckListDBService } from './check-list-db.service';
import { environment } from 'src/environments/environment';
import { CheckListMockService } from './check-list-mock.service';
import { CheckListLocalstorageService } from './check-list-localstorage.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: CheckListService,
      useClass: !environment.useFakeDB
        ? CheckListDBService
        : CheckListLocalstorageService,
    },
  ],
})
export class ChecklistServicesModule {}
