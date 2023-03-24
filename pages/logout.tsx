import { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { persistor } from 'src/store';
import { LOGIN_ROUTE } from 'src/constants/routes';
import { useAppDispatch } from 'src/hooks';
import { signOut } from 'src/slices/auth';

function LogOut() {
  const nextRouter = useRouter();
  const appDispatch = useAppDispatch();

  const confirmLogout = async () => {
    let user;
    try {
      /* develblock:start */
      if (process.env.NEXT_PUBLIC_AMPLIFY_MOCK === '1') {
        const MockAuth = await import('mock-amplify-auth');
        console.log({ MockAuth, flag: process.env.NEXT_PUBLIC_AMPLIFY_MOCK });
        user = await MockAuth.currentSession();
      }
      /* develblock:end */

      // clear any saved state
      persistor.purge();

      user = await Auth.currentAuthenticatedUser();
      if (user) {
        if (typeof window !== 'undefined') {
          console.error('Signing you out, redirecting to login....');
          appDispatch(signOut());
          localStorage.clear();
        }
      }
      nextRouter.push(LOGIN_ROUTE);
    } catch (e) {
      // clear any saved state
      persistor.purge();

      if (typeof window !== 'undefined') {
        localStorage.clear();
        console.error('redirecting to login....');
        nextRouter.push(LOGIN_ROUTE);
      }
    }
  };

  useEffect(() => {
    confirmLogout();
  });

  return null;
}

export default LogOut;
