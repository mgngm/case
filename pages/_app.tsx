import { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { ThemeProvider } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Amplify, Auth, API } from 'aws-amplify';
import { enableMapSet } from 'immer';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { store, persistor } from 'src/store';
import config from 'src/aws-exports';
import RequireAuth from 'src/components/auth/require-auth';
import 'styles/globals.scss';
import { RESPONSE_TYPE } from 'src/constants/auth';
import { removeHubListener, setupHubListener } from 'src/logic/client/auth';
import { migrateS3InfoToDynamo } from 'src/logic/client/s3';
import { getAuthHeader, selectAllCachedQueriesByEndpoint } from 'src/slices/api';
import theme from 'styles/mui-theme';

enableMapSet();

function Tesseract({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      config.oauth = {
        ...config.oauth,
        // eslint-disable-next-line
        // @ts-ignore: We want to hardcode the oauth bits
        responseType: RESPONSE_TYPE,
        redirectSignIn: `${`${window.location.protocol}//${window.location.host}`}/login/`,
        redirectSignOut: `${`${window.location.protocol}//${window.location.host}`}/logout/`,
      };

      Amplify.configure(config);
      Auth.configure({ awsmobile: config });

      window.DEBUG = {
        getState: store.getState,
        redux: {
          selectCachedQueries: (endpointName: string) =>
            selectAllCachedQueriesByEndpoint(store.getState(), endpointName),
        },
        jwt: async () => (await Auth.currentAuthenticatedUser()).signInUserSession.idToken.jwtToken,
        aws: {
          Auth,
          config,
          api: {
            filterParse: async ({ path, method, body }: { path: string; method: string; body?: unknown }) => {
              let resp;
              const initObj = {
                headers: {
                  // Authorization: (await window.DEBUG.jwt()),
                  'Content-Type': 'application/json',
                },
                response: true,
              };
              switch (method) {
                case 'POST':
                case 'post':
                  resp = await API.post('filterParseApi', path, { ...initObj, body });
                  break;
                case 'GET':
                case 'get':
                  resp = await API.get('filterParseApi', path, initObj);
                  break;
                default:
                  return 'No method';
              }

              return resp;
            },
          },
        },
        API: async (url: string, method: string, data: unknown, contentType = 'application/json') =>
          await (
            await fetch(url, {
              method,
              body: data ? JSON.stringify(data) : undefined,
              headers: new Headers({ 'content-type': contentType, authorization: await getAuthHeader() }),
            })
          ).json(),
        migration: {
          s3: migrateS3InfoToDynamo,
          reportPublishedFlag: () => console.log('Report Publish Migration trigger'),
        },
      };

      setupHubListener();
    }

    return () => {
      removeHubListener();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Actual Experience</title>
        <meta name="description" content="Actual Experience" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Authenticator.Provider>
            <RequireAuth>
              <Component {...pageProps} />
            </RequireAuth>
          </Authenticator.Provider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default Tesseract;
