import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-checklist-form-modal',
  templateUrl: './checklist-form-modal.component.html',
  styleUrls: ['./checklist-form-modal.component.scss'],
})
export class ChecklistFormModalComponent implements OnInit, OnDestroy {
  @Input()
  public parentTitle: string;

  @Input()
  public autorunRecognization: boolean = false;

  @Input()
  public modalGuid: string;

  @Input()
  public value: any;

  @Input()
  public isEditMode: boolean = false;

  public dataChanges$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public validChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(public modalController: ModalController) {}

  ngOnDestroy(): void {
    this.dataChanges$.complete();
    this.validChanges$.complete();
    this.unsubscribe$.next();
  }

  ngOnInit() {
    combineLatest([this.validChanges$, this.dataChanges$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([isValid, data]) => {
        if (isValid && !!data) {
          this.modalController.dismiss(data, null, this.modalGuid);
        }
      });
  }

  public onClose() {
    this.modalController.dismiss(null, null, this.modalGuid);
  }
}
