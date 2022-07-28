export interface ICheckListItem {
  id: string;
  parentId: string;
  isTemplate: boolean;
  title: string;
  description: string;
  dueDate: Date;
  isDone: boolean;
  isDoneDate: Date;
  /** Колличество дочерних элементов. Вычисляемое поле возвращаемое из БД. */
  childrenCount: number;
  /** Колличество завершённых элементов среди дочерних. */
  childrenDone: number;
}
