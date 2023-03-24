import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, PreloadedState, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import produce from 'immer';
import type { PersistConfig } from 'redux-persist';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { arrayIncludes } from 'src/logic/libs/helpers';
import { listenerInstance } from 'src/middleware/listener';
import { baseApi } from 'src/slices/api';
import context from 'src/slices/context';
import dashboard from 'src/slices/dashboard';
import preview from 'src/slices/preview';
import report from 'src/slices/report';
import users from 'src/slices/users';

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['context', 'dashboard', 'users', 'report', 'preview'],
};

const rootReducer = combineReducers({
  dashboard,
  context,
  users,
  report,
  preview,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof persistedReducer>;

const queriesToClean = ['listDUsByReport', 'fetchReport', 'fetchReportData'];

const actionSanitizer = produce((action: AnyAction) => {
  if (arrayIncludes(queriesToClean, action?.meta?.arg?.endpointName) && action?.meta?.requestStatus === 'fulfilled') {
    action.payload = "cleansed - use window.DEBUG.redux.selectCachedQueries('" + action?.meta?.arg?.endpointName + "')";
  }
});

const stateSanitizer = produce((state: RootState) => {
  for (const [key, entry] of Object.entries(state[baseApi.reducerPath].queries)) {
    if (arrayIncludes(queriesToClean, entry?.endpointName)) {
      // @ts-expect-error intentionally cleansing
      state[baseApi.reducerPath].queries[key] =
        "cleansed - use window.DEBUG.redux.selectCachedQueries('" + entry?.endpointName + "')";
    }
  }
});

export const makeStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: persistedReducer,
    preloadedState,
    devTools: {
      actionSanitizer: actionSanitizer as any,
      stateSanitizer: stateSanitizer as any,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: [baseApi.reducerPath],
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .prepend(listenerInstance.middleware)
        .concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = AppDispatch extends ThunkDispatch<
  infer State,
  infer ExtraThunkArg,
  infer BasicAction
>
  ? ThunkAction<ReturnType, State, ExtraThunkArg, BasicAction>
  : never;

export const store = makeStore();

export const persistor = persistStore(store);
