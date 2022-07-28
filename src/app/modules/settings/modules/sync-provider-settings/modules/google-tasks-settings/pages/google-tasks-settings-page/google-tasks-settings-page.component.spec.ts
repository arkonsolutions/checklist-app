import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GoogleTasksSettingsPageComponent } from './google-tasks-settings-page.component';

describe('GoogleTasksSettingsPageComponent', () => {
  let component: GoogleTasksSettingsPageComponent;
  let fixture: ComponentFixture<GoogleTasksSettingsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleTasksSettingsPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleTasksSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
