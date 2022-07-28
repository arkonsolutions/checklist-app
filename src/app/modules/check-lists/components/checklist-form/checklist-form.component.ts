import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { delay, takeUntil, take } from 'rxjs/operators';
import * as appActions from '../../../../store/app.actions';
import { selectIsRecognizeSpeechAvailable } from 'src/app/store/app.selectors';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'app-checklist-form',
  templateUrl: './checklist-form.component.html',
  styleUrls: ['./checklist-form.component.scss'],
})
export class ChecklistFormComponent implements OnInit, OnDestroy {
  @Input()
  public set value(val: any) {
    this.form.patchValue(val);
  }
  public get value(): any {
    return this.form.value;
  }

  @Input()
  public parentTitle: string;

  @Input()
  public autorunRecognization: boolean = false;

  @Output()
  public dataChanges: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public validChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

  public form: FormGroup;

  public isRecognizeSpeechAvailable$: Observable<boolean> = this.store.select(selectIsRecognizeSpeechAvailable);

  private unsubscribe$: Subject<void> = new Subject<void>();

  private recognizeSpeechTargetField: string;

  constructor(
    private fb: FormBuilder,
    public modalController: ModalController,
    private store: Store,
    private actions$: ActionsSubject
  ) {
    this.form = this.fb.group({
      id: [null],
      parentId: [null],
      isTemplate: [false],
      title: [null, Validators.required],
      description: '',
      dueDate: [null],
      isDone: [false],
      isDoneDate: [null],
      childrenCount: [0],
      childrenDone: [0]
    });

    this.form.statusChanges
      .pipe(takeUntil(this.unsubscribe$), delay(0))
      .subscribe((status) => {
        this.validChanges.emit(status === 'VALID');
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    if (this.autorunRecognization) {
      this.onRecognize('title');
    }

    this.actions$.pipe(
      takeUntil(this.unsubscribe$),
      ofType(appActions.AppActionsEnum.RecognizeSpeechSuccess)
    ).subscribe((res: any) => {
      this.form.get(this.recognizeSpeechTargetField).setValue(res["recognizedText"]);
      this.form.updateValueAndValidity();
    })
  }

  public onSubmit() {
    if (this.form.valid) {
      this.dataChanges.emit(this.form.value);
    }
  }

  public onRecognize(targetField: string) {
    this.recognizeSpeechTargetField = targetField;
    this.store.dispatch(appActions.recognizeSpeech());
  }

}
