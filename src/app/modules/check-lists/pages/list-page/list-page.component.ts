import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ICheckListItem } from 'src/app/modules/check-list-services/model/check-list-item.model';
import { PageComponent } from 'src/app/components/page.component';
import {
  createItem,
  editTarget,
  removeTarget,
  ensureTarget,
  presentTargetParentTree,
  setConfigIsShowDetailsToggle,
  switchTargetTo,
  toggleItemIsDone,
  replicateTarget,
  shareTargetOptions,
} from '../../store/check-lists.actions';
import {
  selectIsChildrenLoadingForTarget,
  selectTargetChildren,
  selectTarget,
  selectIsItemWithParentBranchLoadingForTarget,
  selectCheckListConfig,
  selectMode,
  selectIsTemplateMode,
  selectIsReplicateGraphLoading,
  selectIsEditItemSaving,
  selectIsCreateItemSaving,
  selectIsRemoveItemSaving,
  selectIsReplicateSaving,
  selectIsShareTargetGraphLoading,
} from '../../store/check-lists.selectors';
import { CheckListConfig } from '../../models/check-list-config.model';
import { CheckListMode } from '../../store/check-lists.state';
import { selectisRecognitionWhenAdding } from 'src/app/modules/settings-store/settings.selectors';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPageComponent extends PageComponent implements OnInit, OnDestroy {

  public readonly dateFormat = 'dd.MM.yyyy HH:mm:ss';

  public isTemplateMode$: Observable<boolean> = this.store.select(selectIsTemplateMode);
  public isReplicationProcess$: Observable<boolean> = combineLatest([
    this.store.select(selectIsReplicateGraphLoading),
    this.store.select(selectIsReplicateSaving)
  ]).pipe(
    map(([isReplicateGraphLoading, isReplicateSaving]) => isReplicateGraphLoading || isReplicateSaving)
  );
  public isShareTargetProcess$: Observable<boolean> = combineLatest([
    this.store.select(selectIsShareTargetGraphLoading)
  ]).pipe(
    map(([isShareTargetGraphLoading]) => isShareTargetGraphLoading)
  );
  public isEditItemSaving$ = this.store.select(selectIsEditItemSaving);
  public isCreateItemSaving$ = this.store.select(selectIsCreateItemSaving);
  public isRemoveItemSaving$ = this.store.select(selectIsRemoveItemSaving);
  public target$: Observable<ICheckListItem> = this.store.select(selectTarget);
  public children$: Observable<ICheckListItem[]> =
    this.store.select(selectTargetChildren);
  public busy$: Observable<boolean> = combineLatest([
    this.store.select(selectIsChildrenLoadingForTarget),
    this.store.select(selectIsItemWithParentBranchLoadingForTarget),
    this.isReplicationProcess$,
    this.isEditItemSaving$,
    this.isCreateItemSaving$,
    this.isRemoveItemSaving$
  ]).pipe(
    map(
      ([isChildrenLoading, isItemWithParentsLoading, isReplicationProcess, isEdit, isCreate, isRemove]) =>
        isChildrenLoading || isItemWithParentsLoading || isReplicationProcess || isEdit || isCreate || isRemove
    )
  );
  public isShareAvailable$: Observable<boolean> = combineLatest([
    this.target$,
    this.children$
  ]).pipe(
    map(([target, children]) => {
      return !!target.id || children.length > 0
    })
  );
  

  public addTaskButtonKey$ = this.target$.pipe(
    map(target => {
      if (!!target && !!target.id) {
        return "pageChecklist.btnAddSubtask";
      } else {
        return "pageChecklist.btnAdd";
      }
    })
  )

  public config: CheckListConfig;

  private unsubscribe$: Subject<void> = new Subject<void>();

  public pageTitleKey$: Observable<string> = this.store.select(selectMode).pipe(
    takeUntil(this.unsubscribe$),
    map(mode => {
      let result = '';
      switch (mode) {
        case CheckListMode.CheckLists:
          result = 'pageChecklist.name';
          break;
        case CheckListMode.Templates:
          result = 'pageTemplate.name';
          break;
      }
      return result;
    })
  )

  public isRecognitionWhenAdding$: Observable<boolean> = this.store.select(selectisRecognitionWhenAdding);

  constructor(
    store: Store
  ) {
    super(store);
    this.store
      .select(selectCheckListConfig)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((config) => {
        this.config = config;
      });
  }

  trackByMethod(index:number, el:ICheckListItem): string {
    return el.id;
  }

  ngOnInit(): void {
    this.store.dispatch(ensureTarget());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public async presentParentTree() {
    this.store.dispatch(presentTargetParentTree());
  }

  public navTo(id: string) {
    this.store.dispatch(switchTargetTo({ id }));
  }

  public toggleIsShowDetails() {
    this.store.dispatch(setConfigIsShowDetailsToggle());
  }

  public toggleChecked($event: MouseEvent, id: string) {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.store.dispatch(toggleItemIsDone({ id, date: new Date() }));
  }

  public onAddClick() {
    this.store.dispatch(createItem({}));
  }

  public onEditClick() {
    this.store.dispatch(editTarget());
  }

  public onRemoveClick() {
    this.store.dispatch(removeTarget());
  }

  public onReplicateTargetClick() {
    this.store.dispatch(replicateTarget());
  }

  public onShareClick() {
    this.store.dispatch(shareTargetOptions());
  }
}
