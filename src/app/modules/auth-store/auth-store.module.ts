import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { featureKey } from './auth.state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth.effects';
import { authReducer } from './auth.reducers';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ]
})
export class AuthStoreModule { }
