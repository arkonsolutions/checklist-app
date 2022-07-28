import { createAction, props, union } from "@ngrx/store";
import { AuthProviderEnum } from "./model/auth-provider.enum";
import { UserIdentity } from "./model/user-identity.model";

export enum AuthActionsEnum {
  Initialize = '[Auth] Initialize',
  InitializeSuccess = '[Auth] Initialize Success',
  InitializeFailure = '[Auth] Initialize Failure',
  /** Вход для всех провайдеров, для которых имеется refreshtoken */
  SilentSignInForAll = '[Auth] SilentSignInForAll',
  SilentSignIn = '[Auth] SilentSignIn',
  SignIn = '[Auth] SignIn',
  SignInSuccess = '[Auth] SignIn Success',
  SignInFailure = '[Auth] SignIn Failure',
  SignOut = '[Auth] SignOut',
  SignOutSuccess = '[Auth] SignOut Success',
  SignOutFailure = '[Auth] SignOut Failure'
}

export const initialize = createAction(
  AuthActionsEnum.Initialize
);
export const initializeSuccess = createAction(
  AuthActionsEnum.InitializeSuccess
);
export const initializeFailure = createAction(
  AuthActionsEnum.InitializeFailure,
  props<{error: any}>()
);

export const silentSignInForAll = createAction(
  AuthActionsEnum.SilentSignInForAll
);

export const silentSignIn = createAction(
  AuthActionsEnum.SilentSignIn,
  props<{provider: AuthProviderEnum}>()
);

export const signIn = createAction(
  AuthActionsEnum.SignIn,
  props<{provider: AuthProviderEnum}>()
);
export const signInSuccess = createAction(
  AuthActionsEnum.SignInSuccess,
  props<{provider: AuthProviderEnum, identity: UserIdentity}>()
);
export const signInFailure = createAction(
  AuthActionsEnum.SignInFailure,
  props<{provider: AuthProviderEnum, error: any}>()
);

export const signOut = createAction(
  AuthActionsEnum.SignOut,
  props<{provider: AuthProviderEnum}>()
);
export const signOutSuccess = createAction(
  AuthActionsEnum.SignOutSuccess,
  props<{provider: AuthProviderEnum}>()
);
export const signOutFailure = createAction(
  AuthActionsEnum.SignOutFailure,
  props<{provider: AuthProviderEnum, error: any}>()
);

const all = union({
  initialize,
  initializeSuccess,
  initializeFailure,
  silentSignIn,
  signIn,
  signInSuccess,
  signInFailure,
  signOut,
  signOutSuccess,
  signOutFailure
});

export type AuthActionsUnion = typeof all;