import { createReducer, on } from "@ngrx/store";
import * as syncState from './sync.state';
import * as syncActions from './sync.actions';

export const syncReducer = createReducer(
  syncState.initialState,
  on(syncActions.initialize, (state) => ({
    ...state
  })),
  on(syncActions.initializeSuccess, (state, { providers }) => ({
    ...state,
    providers: providers.map(p => ({
      isEnabled: false,
      isSyncProcess: false,
      isExportDataProcess: false,
      isImportDataProcess: false,
      status: null,
      isEnablingToggleProcess: false,
      key: p
    }))
  })),

  on(syncActions.enableProvider, (state, {provider}) => ({
    ...state,
    providers: state.providers.map(sp => {
      return sp.key !== provider 
        ? sp
        : {
          ...sp, 
          isEnablingToggleProcess: true,
          status: {
            date: new Date(),
            message: 'Включение синхронизации'
          }
        }
    })
  })),
  on(syncActions.enableProviderSuccess, (state, {provider}) => ({
    ...state,
    providers: state.providers.map(sp => {
      return sp.key !== provider 
        ? sp
        : {
          ...sp, 
          isEnablingToggleProcess: false,
          isEnabled: true,
          status: {
            date: new Date(),
            message: 'Синхронизация подключена'
          }
        }
    })
  })),
  on(syncActions.enableProviderFailure, (state, {provider}) => ({
    ...state,
    providers: state.providers.map(sp => {
      return sp.key !== provider 
        ? sp
        : {
          ...sp, 
          isEnablingToggleProcess: false,
          isEnabled: false,
          status: {
            date: new Date(),
            message: 'Ошибка подключения синхронизации'
          }
        }
    })
  })),


  on(syncActions.disableProvider, (state, {provider}) => ({
    ...state,
    providers: state.providers.map(sp => {
      return sp.key !== provider 
        ? sp
        : {
          ...sp, 
          isEnablingToggleProcess: true,
          status: {
            date: new Date(),
            message: 'Отключение синхронизации'
          }
        }
    })
  })),
  on(syncActions.disableProviderSuccess, (state, {provider}) => ({
    ...state,
    providers: state.providers.map(sp => {
      return sp.key !== provider 
        ? sp
        : {
          ...sp, 
          isEnablingToggleProcess: false,
          isEnabled: false,
          status: {
            date: new Date(),
            message: 'Синхронизация отключена'
          }
        }
    })
  })),
  on(syncActions.disableProviderFailure, (state, {provider}) => ({
    ...state,
    providers: state.providers.map(sp => {
      return sp.key !== provider 
        ? sp
        : {
          ...sp, 
          isEnablingToggleProcess: false,
          status: null
        }
    })
  })),

  on(syncActions.exportDataProcess, (state) => ({
    ...state,
    isExportDataProcess: true
  })),
  on(syncActions.exportDataSuccess, (state) => ({
    ...state,
    isExportDataProcess: false
  })),
  on(syncActions.exportDataFailure, (state) => ({
    ...state,
    isExportDataProcess: false
  })),

  on(syncActions.importDataDismiss, (state) => ({
    ...state,
    isImportDataProcess: false
  })),
  on(syncActions.importDataProcess, (state) => ({
    ...state,
    isImportDataProcess: true
  })),
  on(syncActions.importDataSuccess, (state) => ({
    ...state,
    isImportDataProcess: false
  })),
  on(syncActions.importDataFailure, (state) => ({
    ...state,
    isImportDataProcess: false
  }))
);