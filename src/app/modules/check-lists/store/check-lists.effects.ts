/*eslint-disable eqeqeq*/
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { combineLatest, from, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { CheckListService } from 'src/app/modules/check-list-services/check-list.service';
import { ECheckListActions } from './check-lists.actions';
import * as checkListActions from './check-lists.actions';
import * as appActions from '../../../store/app.actions';
import { NavigationExtras, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { ChecklistFormModalComponent } from '../components/checklist-form-modal/checklist-form-modal.component';
import { ICheckListItem } from '../../check-list-services/model/check-list-item.model';
import { Action, Store } from '@ngrx/store';
import {
  selectCheckListConfig,
  selectIsChildrenLoadingForTarget,
  selectIsTemplateMode,
  selectLoadedItems,
  selectLoadedAvailableItems,
  selectTarget,
  selectTargetBreadcumbs,
  selectTargetChildren,
  selectTargetId,
} from './check-lists.selectors';
import { Guid } from 'guid-typescript';
import { CheckListMode } from './check-lists.state';
import {
  selectIsHideCompletedTasks, selectisRecognitionWhenAdding
} from '../../settings-store/settings.selectors';
import { TranslateService } from '@ngx-translate/core';
import { selectIsRecognizeSpeechAvailable } from 'src/app/store/app.selectors';

@Injectable()
export class CheckListEffects implements OnInitEffects {
  ensureTarget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.EnsureTarget),
      switchMap(() => [
        checkListActions.ensureItemWithParentBranchForTarget(),
        checkListActions.ensureChildrenItemsForTarget({ forceReload: false }),
      ])
    )
  );

  ensureItemWithParentBranchForTarget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.EnsureItemWithParentBranchForTarget),
      withLatestFrom(
        this.store.select(selectTargetId),
        this.store.select(selectTarget)
      ),
      filter(([action, targetId, target]) => !!targetId && !target),
      map(([action, targetId, target]) => {
        return checkListActions.getItemWithParentBranchRequest({ id: targetId });
      })
    )
  );
  getItemWithParentBranchRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.GetItemWithParentBranchRequest),
      withLatestFrom(this.store.select(selectIsHideCompletedTasks)),
      mergeMap(([action, isHideCompletedTasks]) => {
        const id = action.id;
        return this.service.getItemWithParentBranch(id, isHideCompletedTasks).pipe(
          tap((response) => {
            if (response.length === 0) {
              throw Error(this.translateService.instant("common.itemNotFound"));
            }
          }),
          map((response) =>
            checkListActions.getItemWithParentBranchRequestSuccess({
              id,
              items: response,
            })
          ),
          catchError((error) =>
            of(
              checkListActions.getItemWithParentBranchRequestFailure({
                id,
                error,
              })
            )
          )
        );
      })
    )
  );
  getItemWithParentBranchRequestFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.GetItemWithParentBranchRequestFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

  ensureChildrenItemsForTarget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.EnsureChildrenItemsForTarget),
      mergeMap((action) =>
        of(!!action.forceReload)
          .pipe(
            withLatestFrom(
              this.store.select(selectTargetId),
              this.store.select(selectTarget),
              this.store.select(selectTargetChildren),
              this.store.select(selectIsChildrenLoadingForTarget)
            )
          )
          .pipe(
            filter(
              ([
                forceReload,
                targetId,
                target,
                targetLoadedChildren,
                isLoading,
              ]) => {
                /** Родительский элемент - рутовый(служебный). Колл-во дочерних на данный момент не известно. */
                const targetIsInitialRoot =
                  !!target && target.childrenCount == null;
                /** Известно, что у родительского нет дочерних элементов. */
                const targetChildrenNotPresented =
                  !!target && target.childrenCount === 0;
                /** Колличество дочерних - известно. Равняется колличеству уже загруженных. */
                const targetChildrenEquealsLoaded =
                  !!target &&
                  target.childrenCount === targetLoadedChildren.length;
                //Загружать данные из БД только если не происходит загрузки для этого ID и ранее небыло загружено для этого id.
                const targetChildrenNotCompleteLoaded =
                  targetIsInitialRoot ||
                  (!targetChildrenEquealsLoaded && !targetChildrenNotPresented);
                return (
                  !isLoading && (targetChildrenNotCompleteLoaded || forceReload)
                );
              }
            ),
            map(
              ([
                forceReload,
                targetId,
                target,
                targetLoadedChildren,
                isLoading,
              ]) => checkListActions.getChildrenItemsRequest({ id: targetId })
            )
          )
      )
    )
  );
  getChildrenItemsRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.GetChildrenItemsRequest),
      withLatestFrom(this.store.select(selectIsHideCompletedTasks)),
      mergeMap(([action, isHideCompletedTasks]) => {
        const parentId = action.id;
        return this.service.getChildren(parentId, [], isHideCompletedTasks).pipe(
          map((response) =>
            checkListActions.getChildrenItemsRequestSuccess({
              id: parentId,
              items: response,
            })
          ),
          catchError((error: any) =>
            of(
              checkListActions.getChildrenItemsRequestFailure({
                id: parentId,
                error,
              })
            )
          )
        );
      })
    )
  );
  getChildrenItemsRequestFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.GetChildrenItemsRequestFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

  createItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ECheckListActions.CreateItem),
        withLatestFrom(this.store.select(selectTarget), this.store.select(selectIsTemplateMode), this.store.select(selectIsRecognizeSpeechAvailable), this.store.select(selectisRecognitionWhenAdding)),
        mergeMap(async ([action, target, isTemplateMode, isRecognizeSpeechAvailable, isRecognitionWhenAdding]) => {
          let formVal = !!action.modifiedItemData ? action.modifiedItemData :
            {
              id: Guid.create().toString(),
              parentId: !!target ? target.id : null,
              isTemplate: isTemplateMode,
              isDone: false
            };
          const modal: HTMLIonModalElement = await this.modalController.create({
            component: ChecklistFormModalComponent,
            componentProps: {
              parentTitle: (!!target && !!target.id) ? target.title : '',
              value: formVal,
              autorunRecognization: isRecognizeSpeechAvailable && isRecognitionWhenAdding
            },
          });
          modal.onDidDismiss().then(data => {
            if (!!data.data) {
              this.store.select(selectLoadedItems).pipe(
                take(1)
              ).subscribe(loadedItems => {
                let item = data.data as ICheckListItem;
                let affectedItems = this.service.calculateAffectedWhenAdding(loadedItems, item);
                this.store.dispatch(checkListActions.createItemSave({item, affectedItems}));
              })
            }
          });
          return await modal.present();
        })
      ),
    { dispatch: false }
  );
  createItemSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.CreateItemSave),
      mergeMap((action) => {
        return this.service.createItems([action.item], action.affectedItems).pipe(
          map((response: ICheckListItem[]) => {
            return checkListActions.createItemSaveSuccess({ item: response[0] });
          }),
          catchError((error) => {
            return this.store.select(selectLoadedItems).pipe(
              take(1),
              map((loadedItems) => {
                //recalculate items to revert store state
                let affectedItemsForRevert = this.service.calculateAffectedWhenRemoving(loadedItems, action.item.id, action.item.isDoneDate);
                return checkListActions.createItemSaveFailure({
                  item: action.item,
                  error: error,
                  affectedItems: affectedItemsForRevert
                });
              })
            )
          })
        );
      })
    )
  );
  createItemSaveFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.CreateItemSaveFailure),
      switchMap((action) => 
        of(checkListActions.createItem({modifiedItemData: { ...action.item, id: Guid.create().toString() } }), appActions.displayError({ error: action.error })
      ))
    )
  );

  
  editTarget$ = createEffect(() => this.actions$.pipe(
    ofType(ECheckListActions.EditTarget),
    withLatestFrom(this.store.select(selectTarget)),
    map(([action, target]) => checkListActions.editItem({item: {...target}}))
  ));
  editItem$ = createEffect(() => this.actions$.pipe(
    ofType(ECheckListActions.EditItem),
    mergeMap(async (action) => {
      const modal: HTMLIonModalElement = await this.modalController.create({
        component: ChecklistFormModalComponent,
        componentProps: {
          isEditMode: true,
          value: {...!!action.modifiedItemData ? action.modifiedItemData : action.item},
        },
      });
      modal.onDidDismiss().then(data => {
        if (!!data.data) {
          this.store.dispatch(checkListActions.editItemOK({item: action.item, modifiedItemData: data.data}))
        }
      });
      return await modal.present();
    })
  ), {dispatch: false});
  editItemOK$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ECheckListActions.EditItemOK),
      withLatestFrom(this.store.select(selectLoadedItems)),
      map(([action, loadedItems]) => {
        let affectedItems = this.service.calculateAffectedChanges(loadedItems, action.item.id, new Date(), action.item.isDone, false);
        return checkListActions.editItemSave({item: action.item, modifiedItemData: action.modifiedItemData, affectedItems: affectedItems});
      })
    )
  );
  editItemSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.EditItemSave),
      mergeMap((action) => {
        return this.service.editItem(action.modifiedItemData, action.affectedItems).pipe(
          map((response: ICheckListItem) => {
            return checkListActions.editItemSaveSuccess({ item: action.item, modifiedItemData: response });
          }),
          catchError((error) => {
            return this.store.select(selectLoadedItems).pipe(
              take(1),
              map((loadedItems) => {
                return checkListActions.editItemSaveFailure({
                  item: action.item,
                  modifiedItemData: action.modifiedItemData,
                  error: error
                });
              })
            )
          })
        );
      })
    )
  );
  editItemSaveFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.EditItemSaveFailure),
      switchMap((action) => 
        of(checkListActions.editItem({item: action.item, modifiedItemData: action.modifiedItemData}), appActions.displayError({ error: action.error })
      ))
    )
  );



  removeTarget$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ECheckListActions.RemoveTarget),
      withLatestFrom(this.store.select(selectTarget)),
      map(([action, target]) => checkListActions.removeItem({ item: {...target} }))
    )
  );
  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.RemoveItem),
      withLatestFrom(this.store.select(selectLoadedItems)),
      mergeMap(async ([action, loadedItems]) => {
        const confirmPromiseAction = this.alertController
            .create({
              message: this.translateService.instant("common.confirmDeleteItem", {title: action.item.title}),
              buttons: [
                {
                  text: this.translateService.instant("common.cancel"),
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: this.translateService.instant("common.delete"),
                  role: 'ok',
                },
              ],
            })
            .then((alert) => alert.present().then(() => alert.onDidDismiss()))
            .then((res) => {
              if (res.role === 'ok') {
                
                let itemParent = loadedItems.find(itm => itm.id == action.item.parentId);
                let affectedItems = this.service.calculateAffectedWhenRemoving(loadedItems, action.item.id, new Date());

                this.store.dispatch(checkListActions.switchTargetTo(itemParent));
                this.store.dispatch(checkListActions.removeItemSave({ item: action.item, affectedItems: affectedItems }));
              }
            });
      })
    )
  , {dispatch: false});
  removeItemSave$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ECheckListActions.RemoveItemSave),
        withLatestFrom(this.store.select(selectLoadedItems)),
        mergeMap(([action, loadedItems]) => {
          return this.service.removeItem(action.item, action.affectedItems).pipe(
            map((response) => checkListActions.removeItemSaveSuccess({ item: action.item })),
            catchError((error) => {
              let affectedItemsForRevert = this.service.calculateAffectedWhenAdding(loadedItems, action.item);
              return of(checkListActions.removeItemSaveFailure({ item: action.item, affectedItems: affectedItemsForRevert, error: error }));
            })
          )
        })
      )
  );
  removeItemSaveFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.RemoveItemSaveFailure),
      switchMap((action) => of(
          checkListActions.switchTargetTo(action.item),
          checkListActions.removeItem({ item: action.item }), 
          appActions.displayError({ error: action.error })
        )
      )
    )
  );



  presentTargetParentTree$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ECheckListActions.PresentTargetParentTree),
        withLatestFrom(this.store.select(selectTargetBreadcumbs)),
        switchMap(
          async ([action, breadcrumbs]) =>
            await this.actionSheetController.create({
              header: this.translateService.instant("pageChecklist.internal.goToParent"),
              buttons: [
                ...breadcrumbs.map((b) => ({
                  text: !!b.id ? b.title : this.translateService.instant("pageChecklist.internal.goToHome"),
                  icon: !!b.id ? 'arrow-up-outline' : 'home-outline',
                  handler: () => {
                    this.store.dispatch(
                      checkListActions.switchTargetTo({ id: b.id })
                    );
                  },
                })),
                {
                  text: this.translateService.instant("common.cancel"),
                  icon: 'close',
                  role: 'cancel',
                  handler: () => {},
                },
              ],
            })
        ),
        tap((actionSheet: HTMLIonActionSheetElement) => {
          actionSheet.present();
        })
      ),
    { dispatch: false }
  );

  switchTargetTo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ECheckListActions.SwitchTargetTo),
        tap((action) => {
          const id = action.id;
          let navExtras = { queryParamsHandling: 'preserve' } as NavigationExtras;
          if (action.mode != null) {
            navExtras = {
              ...navExtras,
              queryParamsHandling: null,
              queryParams: {
                ...navExtras.queryParams,
                mode: action.mode === CheckListMode.Templates ? 'templates' : null
              }
            }
          }
          this.router.navigate(['/check-lists', ...[!!id ? String(id) : []]], navExtras);
        })
      ),
    { dispatch: false }
  );

  setConfigIsShowDetailsToggle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.SetConfigIsShowDetailsToggle),
      map((action) => checkListActions.configStore())
    )
  );

  configStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.ConfigStore),
      withLatestFrom(this.store.select(selectCheckListConfig)),
      switchMap(([action, config]) => this.service.storeConfig(config)),
      map(() => checkListActions.configStoreSucess()),
      catchError((err) =>
        of(checkListActions.configStoreFailure({ error: err }))
      )
    )
  );
  configStoreFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.ConfigStoreFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );
  configRestore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.ConfigRestore),
      switchMap((action) => this.service.restoreConfig()),
      filter((config) => !!config),
      map((config) => checkListActions.configRestoreSuccess({ config })),
      catchError((err) =>
        of(checkListActions.configRestoreFailure({ error: err }))
      )
    )
  );
  configRestoreFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.ConfigRestoreFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

  toggleItemIsDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.ToggleItemIsDone),
      withLatestFrom(this.store.select(selectLoadedItems)),
      mergeMap(([action, loadedItems]) => {
        const { id: itemId, date } = action;
        
        //TODO: Определить элементы, которые будут затрагиваться и показать предупреждение.
        let targetItem = loadedItems.find(itm => itm.id === action.id);
        let affectedItems = this.service.calculateAffectedChanges(loadedItems, action.id, action.date, !targetItem.isDone, false);

        const item = loadedItems.find((li) => li.id === itemId);
        if (!item) {
          throw new Error(this.translateService.instant("common.itemNotFound"));
        }
        const newIsDoneValue = !item.isDone;
        let warningMessage = null;

        if (
          newIsDoneValue &&
          item.childrenCount > 0 &&
          item.childrenDone < item.childrenCount
        ) {
          warningMessage = this.translateService.instant("pageChecklist.internal.anywayAsDone", {childrenDone: item.childrenDone, childrenCount: item.childrenCount, title: item.title});
        }

        if (
          !newIsDoneValue &&
          item.childrenCount > 0 &&
          item.childrenCount === item.childrenDone
        ) {
          warningMessage = this.translateService.instant("pageChecklist.internal.anywayAsUndone", {childrenDone: item.childrenDone, title: item.title});
        }

        if (!!warningMessage) {
          const confirmPromiseAction = this.alertController
            .create({
              message: warningMessage,
              buttons: [
                {
                  text: this.translateService.instant("common.cancel"),
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: this.translateService.instant("common.ok"),
                  role: 'ok',
                },
              ],
            })
            .then((alert) => alert.present().then(() => alert.onDidDismiss()))
            .then((res) => {
              switch (res.role) {
                case 'ok':
                  return checkListActions.setItemIsDoneSave({
                    id: itemId,
                    date,
                    isDoneValue: newIsDoneValue,
                    affectedItems: affectedItems
                  });
                  break;
                default:
                  return checkListActions.toggleItemIsDoneDismiss({
                    id: itemId,
                    date,
                  });
                  break;
              }
            });
          return from(confirmPromiseAction);
        } else {
          return from([
            checkListActions.setItemIsDoneSave({
              id: itemId,
              date,
              isDoneValue: newIsDoneValue,
              affectedItems: affectedItems
            }),
          ]);
        }
      })
    )
  );
  setItemIsDoneSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.SetItemIsDoneSave),
      mergeMap((payload) => {
        return this.service.setItemIsDone(payload.affectedItems).pipe(
          map(() =>
            checkListActions.setItemIsDoneSaveSuccess({
              id: payload.id,
              date: payload.date,
              isDoneValue: payload.isDoneValue,
              affectedItems: payload.affectedItems
            })
          ),
          catchError((error) => {
            return this.store.select(selectLoadedItems).pipe(
              take(1),
              map((loadedItems) => {
                //todo: recalculate items to revert store state
                let affectedItemsForRevert = this.service.calculateAffectedChanges(loadedItems, payload.id, payload.date, !payload.isDoneValue, false);
                return checkListActions.setItemIsDoneSaveFailure({
                  error: error,
                  affectedItems: affectedItemsForRevert
                });
              })
            )
          })
        )
      })
    )
  );
  setItemIsDoneSaveSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ECheckListActions.SetItemIsDoneSaveSuccess),
    withLatestFrom(combineLatest([this.store.select(selectTarget), this.store.select(selectLoadedItems), this.store.select(selectLoadedAvailableItems)])),
    map(([action, [currentTarget, loadedItems, loadedAvailableItems]]) => {
      let message = "";
      action.affectedItems.forEach((itm, idx, arr) => {
        message += `${this.translateService.instant(itm.isDone ? "pageChecklist.internal.taskIsCompleted" : "pageChecklist.internal.taskMustBeCompleted", {title: itm.title})}\r\n`;
      });
      if (message.length > 0) {
        this.store.dispatch(appActions.displayNotification({message: message, mode: "Success"}));
        
        //TODO: В случае, когда выполненный элемент должен быть скрыт, вероятна ситуация, когда скрыть должен быть текущий выбранный элемент.
        //В данном случае необходимо найти ближайший родительский элемент(вплоть до рутового), который может быть отображён и перейти на него.
        let stepTargetId = action.id;
        let nearestAvailableTarget = currentTarget;
        while (!nearestAvailableTarget) {
          stepTargetId = loadedItems.find(li => li.id == stepTargetId)?.parentId;
          nearestAvailableTarget = loadedAvailableItems.find(li => li.id === stepTargetId);
        }
        this.store.dispatch(checkListActions.switchTargetTo({id: nearestAvailableTarget.id}));
      }
    })
  ), {dispatch: false});

  setItemIsDoneSaveFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ECheckListActions.SetItemIsDoneSaveFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

  replicateTargetOptions$ = createEffect(() => this.actions$.pipe(
    ofType(ECheckListActions.ReplicateTarget),
    withLatestFrom(this.store.select(selectTargetId)),
    switchMap(
      async ([action, targetId]) =>
        await this.actionSheetController.create({
          header: this.translateService.instant("pageChecklist.internal.copyEntryHeader"),
          cssClass: 'my-custom-class',
          buttons: [{
            text: this.translateService.instant("pageChecklist.internal.createChecklist"),
            icon: 'add-outline',
            handler: () => {
              this.store.dispatch(checkListActions.replicateCheckList({ id: targetId, replicaTo: CheckListMode.CheckLists }));
            }
          }, {
            text: this.translateService.instant("pageChecklist.internal.createTemplate"),
            icon: 'add-outline',
            handler: () => {
              this.store.dispatch(checkListActions.replicateCheckList({ id: targetId, replicaTo: CheckListMode.Templates }));
            }
          }, {
            text: this.translateService.instant("common.cancel"),
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
          }]
        })
    ),
    tap((actionSheet: HTMLIonActionSheetElement) => {
      actionSheet.present();
    })
  ), {dispatch: false});
replicateCheckList$ = createEffect(() => this.actions$.pipe(
    ofType(ECheckListActions.ReplicateCheckList),
    withLatestFrom(this.store.select(selectIsHideCompletedTasks)),
    mergeMap(([payloadReplica, isHideCompletedTasks]) => {
      return this.service.getItemWithChildrenTree(payloadReplica.id, isHideCompletedTasks).pipe(
        tap((res) => {
          if (res.length === 0) {
            throw new Error(this.translateService.instant("common.itemNotFound"));
          }
        }),
        map((res) => {
          return checkListActions.replicateCheckListLoadGraphSuccess({
            ...payloadReplica,
            loadedItems: res
          });
        }),
        catchError((error) => {
          return of(checkListActions.replicateCheckListLoadGraphFailure({...payloadReplica, error: error}));
        })
      )
    })
  ));
replicateCheckListLoadGraphSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ECheckListActions.ReplicateCheckListLoadGraphSuccess),
      map((payload) => {

        let idToReplicaIdDictionary = payload.loadedItems.reduce((result, item) => {
          return {
            ...result,
            [item.id]: Guid.create().toString()
          }
        }, {});

        let itemsForCreate = payload.loadedItems.map(itm => {
          let replicatedItem = {
            ...itm,
            id: idToReplicaIdDictionary[itm.id],
            parentId: idToReplicaIdDictionary[itm.parentId] || null,
            isDone: false,
            isDoneDate: null,
            childrenCount: itm.childrenCount,
            childrenDone: itm.childrenDone,
            dueDate: null,
            isTemplate: payload.replicaTo === CheckListMode.Templates
          };
          return replicatedItem;
        });

        return checkListActions.replicateCheckListSave({
          id: payload.id,
          replicaId: idToReplicaIdDictionary[payload.id],
          replicaTo: payload.replicaTo,
          itemsForCreate: itemsForCreate
        })
      })
    ));
replicateCheckListLoadGraphFailure$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ECheckListActions.ReplicateCheckListLoadGraphFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );
replicateCheckListSave$ = createEffect(() => this.actions$.pipe(
    ofType(ECheckListActions.ReplicateCheckListSave),
    mergeMap((action) => {
      return this.service.createItems(action.itemsForCreate, []).pipe(
        map((response: ICheckListItem[]) => {
          return checkListActions.replicateCheckListSaveSuccess({  
            id: action.id,
            replicaId: action.replicaId,
            replicaTo: action.replicaTo,
            createdItems: response
          });
        }),
        catchError((error) => {
          return of(checkListActions.replicateCheckListSaveFailure({
            id: action.id,
            replicaId: action.replicaId,
            itemsForCreate: action.itemsForCreate,
            replicaTo: action.replicaTo,
            error: error
          }));
        })
      );
    })
  ));
replicateCheckListSaveSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ECheckListActions.ReplicateCheckListSaveSuccess),
    mergeMap((payload) => [
      checkListActions.switchTargetTo({ id: payload.replicaId, mode: payload.replicaTo }),
      appActions.displayNotification({ 
        message: this.translateService.instant(payload.replicaTo === CheckListMode.CheckLists ? 'pageChecklist.internal.newChecklistCreated' : 'pageChecklist.internal.newTemplateCreated', {title: payload.createdItems.find(ci => ci.id === payload.replicaId).title}), 
        mode: 'Success' 
      })
    ])
  ));
replicateCheckListSaveFailure$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ECheckListActions.ReplicateCheckListSaveFailure),
      map((action) => appActions.displayError({ error: action.error }))
    )
  );

reloadCache$ = createEffect(() => this.actions$.pipe(
  ofType(ECheckListActions.ReloadCache),
  map(() => checkListActions.ensureTarget())
));

shareTargetOptions$ = createEffect(() => this.actions$.pipe(
  ofType(ECheckListActions.ShareTargetOptions),
  tap(async() => {
    let optionIncludeNestedChecked = false;
    const alert = await this.alertController.create({
      header: this.translateService.instant("pageChecklist.internal.shareChecklistAlert.title"),
      message: this.translateService.instant("pageChecklist.internal.shareChecklistAlert.message"),
      buttons: [
        {
          text: this.translateService.instant("common.cancel"),
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: this.translateService.instant("common.share"),
          role: 'confirm',
          handler: (args) => {
            console.log('ok handler optionIncludeNestedChecked', optionIncludeNestedChecked);
          },
        },
      ],
      inputs: [
        {
          id: 'cb',
          name: 'cb',
          type: 'checkbox',
          label: this.translateService.instant("pageChecklist.internal.shareChecklistAlert.includeNestedChecked"),
          handler: (args) => {
            optionIncludeNestedChecked = args.checked;
          }
        }
      ]
    });

    await alert.present();
  })
), {dispatch: false});
shareTarget$ = createEffect(() => this.actions$.pipe(
  ofType(ECheckListActions.ShareTarget),
  withLatestFrom(this.store.select(selectTargetId), this.store.select(selectIsHideCompletedTasks)),
  switchMap(([action, targetId, isHideCompletedTasks]) => {
    return this.service.getItemWithChildrenTree(targetId, isHideCompletedTasks).pipe(
      tap((res) => {
        if (res.length === 0) {
          throw new Error(this.translateService.instant("common.itemNotFound"));
        }
      }),
      map((res) => {
        return checkListActions.shareTargetLoadGraphSuccess({
          id: targetId,
          loadedItems: res
        });
      }),
      catchError((error) => {
        return of(checkListActions.shareTargetLoadGraphFailure({id: targetId, error: error}));
      })
    );
  })
));
shareTargetLoadGraphSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ECheckListActions.ShareTargetLoadGraphSuccess),
      map(({id, loadedItems}) => {
        return appActions.socialShare({message: this.service.humanizeChecklist(id, loadedItems)});
      })
    )
);
shareTargetLoadGraphFailure$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ECheckListActions.ShareTargetLoadGraphFailure),
      map(({id, error}) => appActions.displayError({ error: error.error }))
    )
  );

  constructor(
    private actions$: Actions<checkListActions.CheckListActionsUnion>,
    private service: CheckListService,
    private router: Router,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private store: Store,
    private translateService: TranslateService
  ) {}

  ngrxOnInitEffects(): Action {
    return checkListActions.configRestore();
  }
}
