import { Store } from '@ngrx/store';
import { navigateBack } from '../store/app.actions';

export abstract class PageComponent {
  constructor(public store: Store) {}

  public onBack() {
    this.store.dispatch(navigateBack());
  }
}
