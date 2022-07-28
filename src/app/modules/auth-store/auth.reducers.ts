import { createReducer, on } from '@ngrx/store';
import * as authState from './auth.state';
import * as authActions from './auth.actions';
import { UserIdentity } from './model/user-identity.model';

export const authReducer = createReducer(
  authState.initialState,
  on(authActions.silentSignIn, (state, { provider }) => ({
    ...state,
    signInProcessFor: [...state.signInProcessFor, provider]
  })),
  on(authActions.signIn, (state, {provider}) => ({
    ...state,
    signInProcessFor: [...state.signInProcessFor, provider]
  })),
  on(authActions.signInSuccess, (state, {provider, identity}) => ({
    ...state,
    signInProcessFor: state.signInProcessFor.filter(sipf => sipf !== provider),
    identity: [
      ...state.identity, 
      ...(!!identity ? [identity] : [])
    ]
  })),
  on(authActions.signInFailure, (state, {provider, error}) => ({
    ...state,
    signInProcessFor: state.signInProcessFor.filter(sipf => sipf !== provider)
  })),
  on(authActions.signOut, (state, {provider}) => ({
    ...state,
    signOutProcessFor: [...state.signOutProcessFor, provider]
  })),
  on(authActions.signOutSuccess, (state, {provider}) => ({
    ...state,
    signOutProcessFor: state.signOutProcessFor.filter(sopf => sopf !== provider),
    identity: state.identity.filter(i => i.provider !== provider)
  })),
  on(authActions.signOutFailure, (state, {provider, error}) => ({
    ...state,
    signOutProcessFor: state.signOutProcessFor.filter(sopf => sopf !== provider)
  }))
);
