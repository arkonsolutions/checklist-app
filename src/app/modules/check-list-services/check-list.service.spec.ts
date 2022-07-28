import { TestBed } from '@angular/core/testing';
import { CheckListMockService } from './check-list-mock.service';
import { CheckListService } from './check-list.service';
import { ICheckListItem } from './model/check-list-item.model';

const ITEMS_TREE: ICheckListItem[] = [
  {
    id: "1",
    parentId: null,
    title: 'test parent',
    childrenCount: 2,
    childrenDone: 0,
    isDone: false
  } as ICheckListItem,
  {
    id: "2",
    parentId: null,
    title: 'test parent 2',
    childrenCount: 0,
    childrenDone: 0,
    isDone: false
  } as ICheckListItem,
  {
    id: "3",
    parentId: "1",
    title: 'test child',
    childrenCount: 1,
    childrenDone: 0,
    isDone: false
  } as ICheckListItem,
  {
    id: "4",
    parentId: "1",
    title: 'test child 2',
    childrenCount: 0,
    childrenDone: 0,
    isDone: false
  } as ICheckListItem,
  {
    id: "5",
    parentId: "3",
    title: 'test subchild',
    childrenCount: 0,
    childrenDone: 0,
    isDone: false
  } as ICheckListItem,
  {
    id: "6",
    parentId: "5",
    title: 'test sub subchild',
    childrenCount: 0,
    childrenDone: 0,
    isDone: false
  } as ICheckListItem,
]

const getUpdatedSnapshot = function(service: CheckListService, itemsSnapshot: ICheckListItem[], itemId: string, date: Date, requestedIsDoneValue: boolean, forceWithSameItemValue: boolean): ICheckListItem[] {
  let affectedItems = service.calculateAffectedChanges(itemsSnapshot, itemId, date, true, false);
  //Обновляем общий список обновленными элементами
  return itemsSnapshot.map(is => {
    let asAffected = affectedItems.find(ai => ai.id == is.id);
    return !!asAffected ? asAffected : is;
  });
}

describe('CheckListService', () => {
  let service: CheckListService;
  let itemsSnapshot: ICheckListItem[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CheckListService,
          useClass: CheckListMockService,
        },
      ],
    });

    service = TestBed.inject(CheckListService);
  });

  beforeEach(() => {
    itemsSnapshot = ITEMS_TREE.map(itm => {return {...itm};});
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isDone change: Когда меняем isDone у элемента на true, у которого есть ещё один сестринский(isDone == false), значение isDone из общего родительского не меняется.', () => {

    //У элемента 3, есть сестринский 4. 1 - родительский для обоих.
    //Оба изначально isDone == false.
    //Меняю 3.isDone = true
    //В результате 1.isDone == false по прежнему.

    //set up
    const targetId = "3";
    const shouldBeDone = ["3"];
    const changeDate = new Date();
    const targetItem = itemsSnapshot.find(itm => itm.id === targetId);

    //recalculate parents
    let affectedItems = service.calculateAffectedChanges(itemsSnapshot, targetId, changeDate, true, false);

    //assets
    const factDone = affectedItems.filter(itm => itm.isDone).map(itm => itm.id);
    expect(factDone.sort()).toEqual(shouldBeDone.sort());
  });

  it('isDone change: Когда выставляем isDone для всех дочерних, родительский выставляется в isDone = true', () => {
    //Есть родительский элемент 1. У него два дочерних - 3 и 4.
    //Оба изначально isDone = false
    //Выставляем поочерёдно isDone = true.
    //Сначала для 3.isDone = true, при этом 1.isDone == false.
    //Затем для 4.isDone = true, при этом 1.isDone == true

    //set up
    const targetIds = ["3", "4"];
    const changeDate = new Date();
    let shouldBeDoneSteps = {
      [targetIds[0]]: [targetIds[0]],
      [targetIds[1]]: [targetIds[0], targetIds[1], "1"]
    };


    targetIds.forEach((tidItm, tidItx, tidArr) => {
      itemsSnapshot = getUpdatedSnapshot(service, itemsSnapshot, tidItm, changeDate, true, false);
      const factDone = itemsSnapshot.filter(is => is.isDone === true).map(is => is.id);
      expect(factDone.sort()).toEqual(shouldBeDoneSteps[tidItm].sort());
    });
  });

  it('isDone change: isDone родительского элемента снимается всегда, но устанавливается только, если все дочерние выполнены.', () => {
    //Значение элемента 1.isDone == false
    //Элементы 3 и 4 выставляются в isDone = true
    //При этом элемент 1 становистся 1.isDone == true
    //Элемент 4 устанавливается в isDone==false, при этом 1 становится 1.isDone == false

    //set up
    const targetIds = ["3", "4"];
    const changeDate = new Date();
    let shouldBeDoneStepsAdding = {
      [targetIds[0]]: [targetIds[0]], //3 в 3.isDone=true
      [targetIds[1]]: [targetIds[0], targetIds[1], "1"] //4 в 4.isDone = true
    };

    let shouldBeDoneStepsRemoving = {
      [targetIds[1]]: [targetIds[0]], //4 в 4.isDone = false, остётся выбранным только сестренский 3. С 1.isDone снимается
    };


    targetIds.forEach((tidItm, tidItx, tidArr) => {
      itemsSnapshot = getUpdatedSnapshot(service, itemsSnapshot, tidItm, changeDate, true, false);
      const factDone = itemsSnapshot.filter(is => is.isDone === true).map(is => is.id);
      expect(factDone.sort()).toEqual(shouldBeDoneStepsAdding[tidItm].sort());
    });

    itemsSnapshot = getUpdatedSnapshot(service, itemsSnapshot, targetIds[1], changeDate, true, false);
    const factDone = itemsSnapshot.filter(is => is.isDone === true).map(is => is.id);
    expect(factDone.sort()).toEqual(shouldBeDoneStepsAdding[targetIds[1]].sort());
  });

  it('Добавление: Добавление дочернего в true - состоянии инкрементирует счётчик родительского childrenDone и выставляет родительский в isDone, если прочие дочерние в isDone == true.', () => {
    //Элементы 3 и 4 выставляются в isDone = true. (3 и 4 это все дочерние элемента 1)
    //Родительский элемент 1 выставляется в isDone = false.
    //Добавляется элемент 7, с признаком isDone===true
    //Ожидаемый результат. Элемент 1.isDone === true.

    let newItem7 = {
      id: '7',
      parentId: '1',
      isDone: true,
      isDoneDate: new Date(),
      childrenCount: 0,
      childrenDone: 0,
      description: null,
      dueDate: null,
      isTemplate: false,
      title: 'item 7'
    } as ICheckListItem;

    //Элементы 3 и 4 выставляются в isDone = true. (3 и 4 это все дочерние элемента 1)
    let item3setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '3', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item3setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item3setToTrueChanges];
    //Элементы 3 и 4 выставляются в isDone = true. (3 и 4 это все дочерние элемента 1)
    let item4setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '4', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item4setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item4setToTrueChanges];
    //Родительский элемент 1 выставляется в isDone = false.
    let item1setToFalseChanges = service.calculateAffectedChanges(itemsSnapshot, '1', new Date(), false, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item1setToFalseChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item1setToFalseChanges];
    expect(itemsSnapshot.find(e => e.id === '1').isDone).toEqual(false);
    //Добавляется элемент 7, с признаком isDone===true
    let addingItem7Changes = service.calculateAffectedWhenAdding(itemsSnapshot, newItem7);
    itemsSnapshot = itemsSnapshot.filter(is => !addingItem7Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...addingItem7Changes];
    //Ожидаемый результат. Элемент 1.isDone === true.
    expect(itemsSnapshot.find(e => e.id === '1').isDone).toEqual(true);
  });

  it('Добавление: Добавление дочернего в false - состоянии - НЕ инкрементирует счётчик родительского childrenDone и снимает с родительского признак isDone, если он до этого был в isDone==true состоянии.', () => {
    //Элементы 3 и 4 выставляются в isDone = true. (3 и 4 это все дочерние элемента 1)
    //Ожидаймый результат: Элемент 1.isDone === true
    //В дочерние к элементу 1 Добавляется элемент 7, с признаком 7.isDone === false
    //Одижаемый результат: Элемент 1.isDone === false


    //Элементы 3 и 4 выставляются в isDone = true. (3 и 4 это все дочерние элемента 1)
    let item3setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '3', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item3setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item3setToTrueChanges];
    let item4setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '4', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item4setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item4setToTrueChanges];
    //Ожидаймый результат: Элемент 1.isDone === true
    expect(itemsSnapshot.find(e => e.id === '1').isDone).toEqual(true);
    //В дочерние к элементу 1 Добавляется элемент 7, с признаком 7.isDone === false
    let newItem7 = {
      id: '7',
      isDone: false,
      isTemplate: false,
      title: 'item7',
      childrenCount: 0,
      childrenDone: 0,
      parentId: '1',
      description: null,
      dueDate: null,
      isDoneDate: null
    };
    let addingItem7Changes = service.calculateAffectedWhenAdding(itemsSnapshot, newItem7);
    itemsSnapshot = itemsSnapshot.filter(is => !addingItem7Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...addingItem7Changes];
    //Одижаемый результат: Элемент 1.isDone === false
    expect(itemsSnapshot.find(e => e.id === '1').isDone).toEqual(false);
  });

  it('Удаление: Устанавливает parent.isDone==true, если удалён единственный isDone===false дочерний, но оставшиеся имеют признак isDone===true.', () => {
    //Элемент 3 устанавливается в 3.isDone === true
    //Ожидаемый резултат: родительский 1.isDone === false
    //Элемент 4(isDone===false) удаляется
    //Ожидаемый результат: родительский 1.isDone === true


    //Элемент 3 устанавливается в 3.isDone === true
    let item3setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '3', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item3setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item3setToTrueChanges];
    //Ожидаемый резултат: родительский 1.isDone === false
    expect(itemsSnapshot.find(e => e.id === '1').isDone).toEqual(false);
    //Элемент 4(isDone===false) удаляется
    let removingItem4Changes = service.calculateAffectedWhenRemoving(itemsSnapshot,'4', new Date());
    itemsSnapshot = itemsSnapshot.filter(is => !removingItem4Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...removingItem4Changes];
    //Ожидаемый результат: родительский 1.isDone === true
    expect(itemsSnapshot.find(e => e.id === '1').isDone).toEqual(true);
  });

  it('Удаление: не меняет значение parent.isDone, если удалён единственный children (isDone===true)', () => {
    //К элементу 2(нет дочерних) добавляется дочерний элемент 7
    //Элемент 2 устанавливается в isDone === true
    //Ожидаймый результат: 2.isDone === ture, 7.isDone === false
    //Элемент 7 устанавливается в 7.isDone === true
    //Элемент 7 удаляется
    //Ожидаемый результат родительский элемент 2.isDone === true (осталось прежним как до удлаления)


    //К элементу 2(нет дочерних) добавляется дочерний элемент 7
    let newItem7 = {
      id: '7',
      isDone: false,
      isTemplate: false,
      title: 'item7',
      childrenCount: 0,
      childrenDone: 0,
      parentId: '2',
      description: null,
      dueDate: null,
      isDoneDate: null
    };
    let addingItem7Changes = service.calculateAffectedWhenAdding(itemsSnapshot, newItem7);
    itemsSnapshot = itemsSnapshot.filter(is => !addingItem7Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...addingItem7Changes];
    //Элемент 2 устанавливается в isDone === true
    let item2setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '2', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item2setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item2setToTrueChanges];
    //Ожидаймый результат: 2.isDone === ture, 7.isDone === false
    expect(itemsSnapshot.find(itm => itm.id === '2').isDone).toEqual(true);
    expect(itemsSnapshot.find(itm => itm.id === '7').isDone).toEqual(false);
    //Элемент 7 устанавливается в 7.isDone === true
    let item7setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '7', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item7setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item7setToTrueChanges];
    //Элемент 7 удаляется
    let removingItem7Changes = service.calculateAffectedWhenRemoving(itemsSnapshot,'7', new Date());
    itemsSnapshot = itemsSnapshot.filter(is => !removingItem7Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...removingItem7Changes];
    //Ожидаемый результат родительский элемент 2.isDone === true (осталось прежним как до удлаления)
    expect(itemsSnapshot.find(itm => itm.id === '2').isDone).toEqual(true);
  });

  it('Удаление: не меняет значение parent.isDone, если удалён единственный children (isDone===false)', () => {
    //К элементу 2(нет дочерних) добавляется дочерний элемент 7
    //Элемент 2 устанавливается в isDone === true
    //Ожидаймый результат: 2.isDone === true, 7.isDone === false
    //Элемент 7(isDone===false) удаляется
    //Ожидаемый результат родительский элемент 2.isDone === true (осталось прежним как до удаления)

    //К элементу 2(нет дочерних) добавляется дочерний элемент 7
    let newItem7 = {
      id: '7',
      isDone: false,
      isTemplate: false,
      title: 'item7',
      childrenCount: 0,
      childrenDone: 0,
      parentId: '2',
      description: null,
      dueDate: null,
      isDoneDate: null
    };
    let addingItem7Changes = service.calculateAffectedWhenAdding(itemsSnapshot, newItem7);
    itemsSnapshot = itemsSnapshot.filter(is => !addingItem7Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...addingItem7Changes];
    //Элемент 2 устанавливается в isDone === true
    let item2setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '2', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item2setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item2setToTrueChanges];
    //Ожидаймый результат: 2.isDone === true, 7.isDone === false
    expect(itemsSnapshot.find(itm => itm.id === '2').isDone).toEqual(true);
    expect(itemsSnapshot.find(itm => itm.id === '7').isDone).toEqual(false);
    //Элемент 7(isDone===false) удаляется
    let removingItem7Changes = service.calculateAffectedWhenRemoving(itemsSnapshot,'7', new Date());
    itemsSnapshot = itemsSnapshot.filter(is => !removingItem7Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...removingItem7Changes];
    //Ожидаемый результат родительский элемент 2.isDone === true (осталось прежним как до удаления)
    expect(itemsSnapshot.find(itm => itm.id === '2').isDone).toEqual(true);
  });

  it('BUGFIX: В случае удаления элемента 3го уровня(isDone=true) у элемента 1го уровня значение childCount увеличивается на 1 относительно ожидаемого значения. Этого не должно быть.', () => {
    //Структура на которой воспроизводится баг:
    //itemLevel1
    //  - itemLevel2_1
    //  - itemLevel2_2
    //    - itemLevel3
    // Такой структуре сооветствует структура
    // 1
    // - 3
    //    - 5
    // - 4
    // Устанавливаем 5.isDone = true
    // Ожидаемый результат 1.childDone = 1
    // Удаляем 5
    // Ожидаемый результат 1.childDone = 1, т.к. элемент 3 = true(осталось после установки 5 = true). BUG! 1.childDone = 2


    // Устанавливаем 5.isDone = true
    let item5setToTrueChanges = service.calculateAffectedChanges(itemsSnapshot, '5', new Date(), true, false);
    itemsSnapshot = itemsSnapshot.filter(is => !item5setToTrueChanges.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...item5setToTrueChanges];
    // Ожидаемый результат 1.childDone = 1
    expect(itemsSnapshot.find(itm => itm.id === '1').childrenDone).toEqual(1);
    // Удаляем 5
    let removingItem5Changes = service.calculateAffectedWhenRemoving(itemsSnapshot,'5', new Date());
    itemsSnapshot = itemsSnapshot.filter(is => !removingItem5Changes.map(e => e.id).includes(is.id));
    itemsSnapshot = [...itemsSnapshot, ...removingItem5Changes];
    // Ожидаемый результат 1.childDone = 1, (BUG! 1.childDone = 2)
    expect(itemsSnapshot.find(itm => itm.id === '1').childrenDone).toEqual(1);
  })
});

