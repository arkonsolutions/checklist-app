import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import * as appActions from './store/app.actions';
import { Subject } from 'rxjs';
import { takeUntil, take, filter } from 'rxjs/operators';
import { selectUILanguage } from './modules/settings-store/settings.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store,
    private globalization: Globalization,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    SpeechRecognition.available().then(async res => {
      let availableLanguages = [];
      if (res.available) {
        SpeechRecognition.addListener("partialResults", (data: any) => {
          this.store.dispatch(appActions.recognizeSpeechSuccess({recognizedText: data.value[0]}));
        });

        availableLanguages = (await SpeechRecognition.getSupportedLanguages()).languages;
      }
      this.store.dispatch(appActions.recognizeSpeechAvailable({isRecognizeSpeechAvailable: res.available, availableLanguages: availableLanguages}));
    });

    this.store.select(selectUILanguage).pipe(
      takeUntil(this.unsubscribe$),
      filter(uiLanguage => !!uiLanguage),
      take(1)
    ).subscribe(uiLanguage => {
      this.translate.setDefaultLang(uiLanguage);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    SpeechRecognition.stop();
  }
  
}
