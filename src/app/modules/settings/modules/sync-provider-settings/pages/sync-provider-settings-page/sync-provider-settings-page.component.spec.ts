import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';

import { SyncProviderSettingsPageComponent } from './sync-provider-settings-page.component';

describe('SyncProviderSettingsPageComponent', () => {
  let component: SyncProviderSettingsPageComponent;
  let fixture: ComponentFixture<SyncProviderSettingsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncProviderSettingsPageComponent ],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();

    fixture = TestBed.createComponent(SyncProviderSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
