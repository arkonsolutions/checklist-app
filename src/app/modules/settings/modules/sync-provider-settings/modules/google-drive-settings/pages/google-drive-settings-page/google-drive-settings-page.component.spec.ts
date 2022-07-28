import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GoogleDriveSettingsPageComponent } from './google-drive-settings-page.component';

describe('GoogleDriveSettingsPageComponent', () => {
  let component: GoogleDriveSettingsPageComponent;
  let fixture: ComponentFixture<GoogleDriveSettingsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleDriveSettingsPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleDriveSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
