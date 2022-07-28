import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import * as routerState from './router.state';
import { RouterStateUrl } from '../models/router-state-url.model';

// Reducer selectors
export const selectReducerState = createFeatureSelector<
  RouterReducerState<RouterStateUrl>
>(routerState.featureKey);

export const selectRouterInfo = createSelector(selectReducerState, (state) =>
  !!state ? state.state : null
);
