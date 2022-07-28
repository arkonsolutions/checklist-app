import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutPageRoutingModule } from './about-page-routing.module';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/shared/utils/create-translate-loader';
import { HttpClient } from '@angular/common/http';
import { AboutPageComponent } from './about-page.component';


@NgModule({
  declarations: [AboutPageComponent],
  imports: [
    CommonModule,
    IonicModule,
    AboutPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class AboutPageModule { }
