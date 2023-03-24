import type { RootState } from 'src/store';
import type { selectAllCachedQueriesByEndpoint } from 'src/slices/api';

export {};

type RuntimeDebugging = {
  getState: () => RootState;
  redux: {
    selectCachedQueries: (endpointName: string) => ReturnType<typeof selectAllCachedQueriesByEndpoint>;
  };
  jwt: () => Promise<string>;
  API: (url: string, method: string, data: unknown, contentType: string | undefined) => Promise<unknown>;
  migration: {
    s3: () => void;
    reportPublishedFlag: () => void;
  };
  aws: {
    Auth: any;
    config: unknown;
    api: {
      filterParse: (params: any) => Promise<any>;
    };
  };
};

declare global {
  interface Window {
    DEBUG: RuntimeDebugging;
  }
}
