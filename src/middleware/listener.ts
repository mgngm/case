import type { TypedAddListener, TypedRemoveListener, TypedStartListening, TypedStopListening } from '@reduxjs/toolkit';
import { addListener, createListenerMiddleware, removeListener } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from 'src/store';

export const listenerInstance = createListenerMiddleware();

export const startAppListening = listenerInstance.startListening as TypedStartListening<RootState, AppDispatch>;

export const stopAppListening = listenerInstance.stopListening as TypedStopListening<RootState, AppDispatch>;

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

export const removeAppListener = removeListener as TypedRemoveListener<RootState, AppDispatch>;
