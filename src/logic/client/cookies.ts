import type { NextRouter } from 'next/router';
import Cookies from 'universal-cookie';
import { FEDERATION_COOKIE, ACTUAL_LOGIN_KEY } from 'src/constants/auth';
import { UNAUTH_ROUTES, LOGIN_ROUTE } from 'src/constants/routes';
import { federatedSignIn } from 'src/logic/client/auth';
import type { FederationCookie } from 'src/types/auth';

/**
 * Checks for presence of a federation cookie, and logs in if you have one otherwise, redirects the user to the login page (if they aren't there already)
 *
 * params
 * nextRouter: Router object to redirect on an unsuccessful cookie check
 */
export async function checkFederatedCookieAndLogin(nextRouter: NextRouter) {
  const cookies = new Cookies();

  //First we want to check if the federation cookie exists.
  const fedCookie: FederationCookie = cookies.get(FEDERATION_COOKIE);
  const loginKey = localStorage.getItem(ACTUAL_LOGIN_KEY);

  //If it doesn't, let's create one.
  if (fedCookie && !loginKey) {
    federatedSignIn({ provider: fedCookie.provider }, null);
  } else {
    if (!UNAUTH_ROUTES.includes(nextRouter.route)) {
      //Check this so you don't get a no-router-instance error.
      //https://nextjs.org/docs/messages/no-router-instance
      if (typeof window !== 'undefined') {
        console.error('You are not logged in, redirecting to login....');
        nextRouter.push(LOGIN_ROUTE);
      }
    }
  }
}
