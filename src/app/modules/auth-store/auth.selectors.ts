import { createFeatureSelector, createSelector } from "@ngrx/store";
import { featureKey, IAuthState } from "./auth.state";
import { AuthProviderEnum } from "./model/auth-provider.enum";
import { UserIdentity } from "./model/user-identity.model";

export const selectAuthState =
  createFeatureSelector<IAuthState>(featureKey);

export const selectIdentity =
  createSelector(
    selectAuthState, 
    (state: IAuthState) => !!state ? state.identity : null
  );

export const selectProviderIdentity = (provider: AuthProviderEnum) =>
  createSelector(
    selectIdentity, 
    (identity: UserIdentity[]) => !!identity ? identity.find(idn => idn.provider === provider) : null
  );