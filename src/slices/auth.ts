import type { SetStateAction, Dispatch } from 'react';
import { ChallengeName } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
import Router from 'next/router';
import Cookies from 'universal-cookie';
import type { AppThunk } from 'src/store';
import {
  LoginFormState,
  PASSWORD_RESET_REQUIRED,
  FEDERATION_COOKIE,
  COGNITO_DEFAULT_CONTEXT_ATTRIBUTE,
} from 'src/constants/auth';
import { ORGANISATION, PARTNER } from 'src/constants/datastore';
import { HOME_ROUTE, LOGIN_ROUTE } from 'src/constants/routes';
import { errorHasMessage, hasErrorCode } from 'src/logic/libs/helpers';
import type { ContextMap } from 'src/models';
import { baseApi } from 'src/slices/api';
import {
  contextApi,
  searchContexts,
  selectOrgById,
  selectPartnerById,
  setAdminContext,
  setReportContext,
  setUserContext,
} from 'src/slices/context';
import { resetCurrentUser, setCurrentUser, setUserAccessLevel, usersApi, userSignedOut } from 'src/slices/users';
import type { Credentials } from 'src/types/auth';

let _MFAUser: any = null;
let _User: any = null;

/**
 * Signs the user into
 * @param { username, password }: User credentials
 * @param setAuthError: Dispatch actions to set auth error strings on the login form
 */
export function signIn(
  { username, password, confirmPassword }: Credentials,
  setLoginFormState: Dispatch<SetStateAction<LoginFormState>>,
  setAuthError: Dispatch<SetStateAction<string | null>>,
  setAuthInfo: Dispatch<SetStateAction<string | null>>,
  setQRCode: Dispatch<SetStateAction<string | null>>,
  confirmPasswordSubmission = false
): AppThunk<void> {
  return async (dispatch) => {
    let MockAuth;
    setLoginFormState(LoginFormState.Loading);
    /* develblock:start */
    if (process.env.NEXT_PUBLIC_AMPLIFY_MOCK === '1') {
      MockAuth = await import('mock-amplify-auth');
    }
    console.log({ MockAuth, flag: process.env.NEXT_PUBLIC_AMPLIFY_MOCK });
    /* develblock:end */

    //reset auth errors so we know what's actually going on
    setAuthError(null);
    try {
      let res;
      //TODO: Registration integration tests are going to be INTERESTING.
      if (confirmPasswordSubmission && confirmPassword) {
        res = await Auth.completeNewPassword(_User, confirmPassword);
        _User = null;
      } else {
        res = await (MockAuth || Auth).signIn(username, password);
      }

      if (res && res.challengeName) {
        switch (res.challengeName) {
          case ChallengeName.NewPasswordRequired:
            _User = res;
            setAuthInfo('As this is your first time logging in, you will need to reset your password below');
            setLoginFormState(LoginFormState.SetFirstPassword);
            break;
          case ChallengeName.MFASetup: {
            //Get our code to generate a QR code.
            const totp = await Auth.setupTOTP(res);
            _MFAUser = res;
            //Create the qr code here to set on the component
            const qrCode =
              'otpauth://totp/AWSCognito:' + res.username + '?secret=' + totp + '&issuer=' + window.location.hostname;
            setQRCode(qrCode);
            setAuthInfo('Use the QR code below to setup your MFA Authenticator');
            setLoginFormState(LoginFormState.MFASetup);
            break;
          }
          //Same as setup but don't need QR stuff.
          case ChallengeName.SoftwareTokenMFA:
            _MFAUser = res;
            setLoginFormState(LoginFormState.MFA);
            break;
        }
      } else {
        //We've logged in! Let's go to the home //technically should never get here - should we error?
        await dispatch(initialiseUserAndRedirect(setLoginFormState, setAuthError));
      }
    } catch (error) {
      const code = hasErrorCode(error) ? error.code : undefined;
      /**
       * For some stupid reason with AWS if you reset a users password, it doesn't respond a 'NewPasswordRequired' challenge like if you're signing in, it just errors
       */
      if (code && code === PASSWORD_RESET_REQUIRED) {
        setLoginFormState(LoginFormState.ResetPassword);
      } else {
        setLoginFormState(LoginFormState.Password);
        setAuthError?.(
          `There was an error authenticating your user. Error: ${
            errorHasMessage(error) ? error.message : 'No error message available'
          }`
        );
      }
    }
  };
}

/**
 * Signs the user out and redirects them to the login page.
 */
export function signOut(redirect = true): AppThunk<void> {
  return async (dispatch) => {
    //If we are manually signing out, remove our federation cookie so we don't get logged right back in.
    const cookies = new Cookies();

    try {
      dispatch(userSignedOut());
      dispatch(baseApi.util.resetApiState());

      cookies.remove(FEDERATION_COOKIE, {
        path: '/',
        secure: true,
      });
      await Auth.signOut();
    } catch (e) {
      console.error('Error signing out', e);

      if (window) {
        window.localStorage.clear();
        // bypass the router so we can force the page change
        window.location.href = LOGIN_ROUTE;
      }
    }

    redirect && Router.push(LOGIN_ROUTE);
  };
}

/**
 * This function will submit an MFA code and complete sign in.
 * @param { credentials } - Object of credentials to sign in / confirm password with
 * @param setLoginFormState - Sets login state of form
 * @param setAuthError - Sets error state of form
 */
export function submitMFA(
  { otp }: Credentials,
  setLoginFormState: Dispatch<SetStateAction<LoginFormState>>,
  setAuthInfo: Dispatch<SetStateAction<string | null>>,
  setAuthError: Dispatch<SetStateAction<string | null>>,
  setQRCode: Dispatch<SetStateAction<string | null>> | null = null
): AppThunk<void> {
  return async (dispatch) => {
    setLoginFormState(LoginFormState.Loading);

    if (otp && _MFAUser) {
      try {
        //If this is a setup totp attempt, the flow is slightly different.
        //How different? stupid different - I think it's safer to ask user to login now 'device has been registered' or something. This is only for tiny number of users.
        //https://github.com/aws-amplify/amplify-js/issues/7254#issuecomment-868727476
        if (setQRCode) {
          await Auth.verifyTotpToken(_MFAUser, otp);
          //You get put in a weird 'un-authenticated cognito session' here, so sign out to be safe.
          dispatch(signOut(false));
          setLoginFormState(LoginFormState.Email);
          setQRCode(null);
          setAuthInfo('Your device has been successfully registered, please login with your new credentials below');
        } else {
          await Auth.confirmSignIn(_MFAUser, otp, 'SOFTWARE_TOKEN_MFA');
          //We don't want to do this on a finally because it means if you put the wrong QR code in, you can't sign in without refreshing.
          _MFAUser = null;
          await dispatch(initialiseUserAndRedirect(setLoginFormState, setAuthError));
        }
      } catch (error) {
        console.error(error);
        setLoginFormState(LoginFormState.MFA);
        const errorMessage =
          'There was an error with your code. Please try again or contact your system administrator if the issue persists.';

        setAuthError(errorMessage);
      }
    } else {
      setAuthError('Something has gone wrong, please refresh and try again.');
    }
  };
}

/**
 * Post logging in we need to get the logged in user and assign them their initial context
 * @param setAuthError -> sets error message on login form if this dies for some reason.
 * @returns
 */
export function initialiseUserAndRedirect(
  setLoginFormState: Dispatch<SetStateAction<LoginFormState>>,
  setAuthError: Dispatch<SetStateAction<string | null>>
): AppThunk<void> {
  return async (dispatch) => {
    dispatch(resetCurrentUser());
    let redirect = false;
    let contextMappingRes: ContextMap;

    //Clear the user before we try and log in.
    try {
      //Get the current user (and neatly store it in state at the same time)
      //The actual response type the `currentUserInfo` is <any> ...
      const user = await Auth.currentUserInfo();
      const userSub: string = user?.attributes?.sub ?? null;

      //If the user doesn't have a sub then we're done here
      if (!userSub) {
        throw new Error('User does not have a sub attribute');
      }

      //We don't need to unwrap this response because we don't need it, we're just dispatching this to store the user information in the RTKQ slice so it's ready immediately on login
      const userPromise = dispatch(usersApi.endpoints.getCurrentUser.initiate({ userSub }, { forceRefetch: true }));

      //Manually set the user sub here because the matcher on request completion was being a pita. Prevents race conditions too.
      dispatch(setCurrentUser(userSub));

      //Subscribes to the api endpoints for both context and user groups.
      const userContextsPromise = dispatch(
        contextApi.endpoints.getUserContext.initiate({ userSub }, { forceRefetch: true })
      );

      let userContexts;
      //Fetch available user contexts - we need this to map the info for our default org into state.
      try {
        userContexts = await userContextsPromise.unwrap();
      } finally {
        // Remove the subscriptions here.
        userPromise.unsubscribe();
        userContextsPromise.unsubscribe();
      }
      //Check if there is a default org attribute set on the user
      let defaultContext = user?.attributes?.[COGNITO_DEFAULT_CONTEXT_ATTRIBUTE] ?? null;
      const idp = JSON.parse(user.attributes?.identities ?? '[]')[0]?.providerName;

      //If the user has an available idp, they might be global so check in the context mapping table
      if (idp) {
        const contextMappingTablePromise = dispatch(contextApi.endpoints.getIdpContext.initiate({ idp }));
        try {
          contextMappingRes = await contextMappingTablePromise.unwrap();
        } catch {
          contextMappingRes = {} as ContextMap;
        } finally {
          // Remove the subscription here.
          contextMappingTablePromise.unsubscribe();
        }

        //If we haven't got a default context from the user then set the one mapped to their idp.
        if (!defaultContext) {
          defaultContext = contextMappingRes.defaultContext ?? null;
        }
      }

      let initialReportContext;
      let initialAdminContext;
      let initialUserContext;

      //If there is a default context set on either the user or their idp, set that and redirect.

      //Because we use the search here which checks which contexts are available to the user,
      // if this is set AFTER you move a user away from a context in the admin, this will still be ok.
      if (defaultContext) {
        const contextInfo = searchContexts(userContexts, defaultContext);

        if (contextInfo) {
          initialReportContext = contextInfo.id;
          initialAdminContext = contextInfo.id;
          initialUserContext = contextInfo.id;
          redirect = true;
        }
      }

      //Set the access level from the response.
      dispatch(setUserAccessLevel(userContexts.accessLevel));

      //If we don't have a default org set for the user, we should go find one for them - we technically shouldn't ever get here but lets be safe.
      if (!redirect) {
        //if we have more than one context available, we're a partner / global level user so select the first partner level context as your user context, and the first org level context as the other two
        if (userContexts[ORGANISATION].ids.length > 1) {
          const partnerLevelContext = selectPartnerById(userContexts[PARTNER], userContexts[PARTNER].ids[0]); //Grab the first partner in the list.
          const orgLevelContext = selectOrgById(userContexts[ORGANISATION], userContexts[ORGANISATION].ids[0]);

          initialUserContext = partnerLevelContext?.id;
          initialReportContext = orgLevelContext?.id;
          initialAdminContext = orgLevelContext?.id;
          //If we only have access to one org, we're org level so set that org as our context.
        } else if (userContexts[ORGANISATION].ids.length === 1) {
          const orgLevelContext = selectOrgById(userContexts[ORGANISATION], userContexts[ORGANISATION].ids[0]);
          //if we have one context only available, you're a basic (org level) user, so set all contexts to this one
          initialUserContext = orgLevelContext?.id;
          initialReportContext = orgLevelContext?.id;
          initialAdminContext = orgLevelContext?.id;
        } else {
          //panik
          throw new Error('No available contexts for user');
        }

        redirect = true;
      }

      if (redirect && initialAdminContext && initialUserContext && initialReportContext) {
        //Set our contexts & user access levels in state
        dispatch(setReportContext(initialReportContext));
        dispatch(setUserContext(initialUserContext));
        dispatch(setAdminContext(initialAdminContext));
        //Succesfully done our stuff, let's go to the landing page!
        Router.push(HOME_ROUTE);
      } else {
        setLoginFormState(LoginFormState.Email);
        setAuthError('Could not find an appropriate user context. Please contact your system administrator');
        //Clear any bits out of state
        dispatch(resetCurrentUser());
      }
    } catch (e) {
      console.error(e);
      setLoginFormState(LoginFormState.Email);
      setAuthError(
        'There was an error setting up your user for login. Please try again or contact your system administrator'
      );
      //Clear any bits out of state
      dispatch(resetCurrentUser());
    }
  };
}
