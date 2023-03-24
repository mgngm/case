import type { SetStateAction, Dispatch } from 'react';
import type { HubCapsule } from '@aws-amplify/core/lib-esm/Hub';
import { Auth, Hub } from 'aws-amplify';
import type { UseFormResetField } from 'react-hook-form';
import Cookies from 'universal-cookie';
import {
  FEDERATION_COOKIE,
  LoginFormState,
  ACTUAL_LOGIN_KEY,
  CODE_EXPIRED,
  CODE_MISMATCH,
  LIMIT_EXCEEDED,
  PIPELINE_EMAIL_ADDRESS,
} from 'src/constants/auth';
import { hasErrorCode } from 'src/logic/libs/helpers';
import { getAuthHeader } from 'src/slices/api';
import type { ForgotPasswordCredentials, LoginFormFields } from 'src/types/auth';

/**
 * Checks if there is a user logged into cognito
 * @returns bool - logged in or not.
 */
export const checkUser = async () => {
  let user;

  try {
    /* develblock:start */
    if (process.env.NEXT_PUBLIC_AMPLIFY_MOCK === '1') {
      const MockAuth = await import('mock-amplify-auth');
      console.log({ MockAuth, flag: process.env.NEXT_PUBLIC_AMPLIFY_MOCK });
      user = await MockAuth.currentSession();
      return user;
    }
    /* develblock:end */

    //We can just make a call here because a failed user will result in a throw
    user = await Auth.currentAuthenticatedUser();

    return user;
  } catch {
    return false;
  }
};

type FederatedSignInProps =
  | {
      provider?: never;
      email: string;
    }
  | {
      provider: string;
      email?: never;
    };

/**
 * Makes a call to the API to attempt a federated sso login. If the user doesn't have a valid IDP, password form will be shown instead.
 * @param domain - The domain of the user trying to login (for example actual-experience.com) to check for a idp provider
 */
export async function federatedSignIn(
  { provider, email }: FederatedSignInProps,
  setLoginFormState: Dispatch<SetStateAction<LoginFormState>> | null = null
) {
  try {
    let domain = provider;
    if (email) {
      //If we are trying to login with the pipeline address, ignore the fact it uses the `actual-experience.com` domain and set the password form.
      if (email === PIPELINE_EMAIL_ADDRESS && setLoginFormState) {
        setLoginFormState(LoginFormState.Password);
        return;
      }

      //Otherwise, split it as normal and do the normal flow below.
      const [, emailDomain] = email.split('@');

      domain = emailDomain;
    }
    if (setLoginFormState) {
      setLoginFormState(LoginFormState.Federation);
    }

    //Call the API to attempt to log us in, or tell us we need to show the password form.
    const reqHeaders = new Headers({
      'content-type': 'application/json',
      authorization: await getAuthHeader(),
    });
    reqHeaders.append('X-LOGIN-FLOW', '1');
    const resp = await fetch('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ domain }),
      headers: new Headers(reqHeaders),
    });

    if (!resp.ok) {
      //TODO: Set Form Error State Here
      throw new Error((await resp.json())?.error);
    }

    //If we have recieved a 204 then there is no provider available for the provided email
    if (resp.status === 204) {
      //If we have been passed the loginFormState fn, we are on /login and can just show the password theme
      if (setLoginFormState) {
        setLoginFormState(LoginFormState.Password);
      } else {
        //Otherwise, we've attempted a federated login and it's failed, so we should be moved to the /login page.
        window.location.assign(`${window.location.origin}/login`);
      }
    }

    //If we've been given back a redirect URL for your SSO, take us there.
    if (resp.status === 200 && resp.ok) {
      localStorage.setItem(ACTUAL_LOGIN_KEY, 'true');
      const data = await resp.json();

      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export async function resetPassword(
  { username, resetPassword, resetCode, resetPasswordConfirm }: ForgotPasswordCredentials,
  setLoginFormState: Dispatch<SetStateAction<LoginFormState>>,
  setAuthError: Dispatch<SetStateAction<string | null>>,
  setAuthInfo: Dispatch<SetStateAction<string | null>>,
  resetField: UseFormResetField<LoginFormFields>
) {
  if (resetPassword !== resetPasswordConfirm) {
    setAuthError('Passwords do not match');
    return;
  }
  try {
    await Auth.forgotPasswordSubmit(username, resetCode, resetPassword);
    //If we get here, the reset has successfully happened, lets go back to the email login form bit.
    setAuthInfo('Password successfully reset! Please try and login with your new credentials below');
    setLoginFormState(LoginFormState.Email);
    resetField('resetPassword');
    resetField('resetPasswordConfirm');
    resetField('resetCode');
  } catch (error) {
    console.error(error);
    const errorCode = hasErrorCode(error) ? error.code : undefined;
    if (errorCode === CODE_EXPIRED) {
      setAuthError('Your reset code has expired, please generate a new one using the Reset Password link below');
    } else if (errorCode === CODE_MISMATCH) {
      setAuthError('The provided reset code was incorrect');
    } else {
      setAuthError('There was an error resetting your password, please contact technical support');
    }
  }
}

export async function forgotPassword(
  { username }: { username: string },
  setLoginFormState: Dispatch<SetStateAction<LoginFormState>>,
  setAuthError: Dispatch<SetStateAction<string | null>>
) {
  try {
    await Auth.forgotPassword(username);
    //If we get here, the reset has successfully happened, lets go back to the email login form bit.
    setLoginFormState(LoginFormState.ResetPassword);
  } catch (error) {
    console.error(error);
    const errorCode = hasErrorCode(error) ? error.code : undefined;
    if (errorCode === LIMIT_EXCEEDED) {
      setAuthError('Too many attempts, please try again later');
    } else {
      setAuthError('There was an error resetting your password, please contact technical support');
    }
  }
}

export const authListener = ({ payload: { event, data } }: HubCapsule) => {
  switch (event) {
    case 'signIn': {
      console.log('[AE] user sign in', data);
      break;
    }
    case 'signedin': {
      console.log('[AE] user signed in', data);
      break;
    }
    case 'confirmSignIn': {
      console.log('[AE] confirm user sign in');
      break;
    }
    case 'cognitoHostedUI': {
      console.log('[AE] federated user signed in', data);
      break;
    }
    case 'parsingCallbackUrl':
    case 'codeFlow': {
      console.log('[AE] federated sign in in progress', data);
      break;
    }
    case 'verifyContact':
      console.log('[AE] verify contact', data);
      break;
    case 'signUp':
      console.log('[AE] user signed up');
      break;
    case 'signOut':
      console.log('[AE] user signed out');
      break;
    case 'signIn_failure': {
      console.error('[AE] user sign in failed');
      //Remove fed cookie here.
      const cookies = new Cookies();
      cookies.remove(FEDERATION_COOKIE, {
        path: '/',
        secure: true,
      });

      break;
    }
    case 'tokenRefresh':
      console.log('[AE] token refresh succeeded');
      break;
    case 'tokenRefresh_failure':
      console.error('[AE] token refresh failed', data);
      break;
    case 'configured':
      console.log('[AE] the Auth module is configured');
      break;
    default:
      console.log('[AE] [default] no event key', data, event);
      break;
  }
};

export const apiListener = ({ payload: { event, data } }: HubCapsule) => {
  console.log(event, data);
};

/**
 * Sets up amplify hub listener for auth events.
 *
 * TODO: Potential to pass dispatch to this, to do something with login form error state?
 */
export const setupHubListener = () => {
  Hub.listen('auth', authListener);
};

export const removeHubListener = () => {
  Hub.remove('auth', authListener);
};

export const setupAPIListener = () => {
  Hub.listen('api', apiListener);
};

export const removeAPIListenter = () => {
  Hub.remove('api', apiListener);
};
