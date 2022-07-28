import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ChecklistFormComponent } from './checklist-form.component';

describe('ChecklistFormComponent', () => {
  let component: ChecklistFormComponent;
  let fixture: ComponentFixture<ChecklistFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChecklistFormComponent],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
        providers: [provideMockStore()]
      }).compileComponents();

      fixture = TestBed.createComponent(ChecklistFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
