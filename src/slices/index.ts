import type { ThunkDispatch } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch } from 'src/store';

export const createAppAsyncThunk = createAsyncThunk.withTypes<
  AppDispatch extends ThunkDispatch<infer State, infer ExtraThunkArg, any>
    ? { state: State; dispatch: AppDispatch; extra: ExtraThunkArg }
    : // eslint-disable-next-line @typescript-eslint/ban-types
      {}
>();
