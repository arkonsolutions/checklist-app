import { AuthProviderEnum } from "./model/auth-provider.enum";
import { UserIdentity } from "./model/user-identity.model";

export const featureKey = 'auth';

export interface IAuthState {
  identity: UserIdentity[];
  signInProcessFor: AuthProviderEnum[];
  signOutProcessFor: AuthProviderEnum[];
}

export const initialState: IAuthState = {
  identity: [],
  signInProcessFor: [],
  signOutProcessFor: []
};
