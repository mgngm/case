import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ADMIN_ROUTE, HOME_ROUTE, LOGIN_ROUTE } from 'src/constants/routes';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { checkUser } from 'src/logic/client/auth';
import { checkFederatedCookieAndLogin } from 'src/logic/client/cookies';
import { selectCurrentUserSub, useGetCurrentUserQuery, userSignedOut } from 'src/slices/users';

function RequireAuth({ children }: { children: JSX.Element }) {
  const nextRouter = useRouter();
  const userSub = useAppSelector(selectCurrentUserSub);
  const dispatch = useAppDispatch();
  const { user, isSuccess } = useGetCurrentUserQuery(
    { userSub },
    {
      skip: !userSub,
      selectFromResult: ({ data, isSuccess }) => ({
        user: data,
        isSuccess,
      }),
    }
  );

  const checkAuth = async () => {
    if (nextRouter.route !== LOGIN_ROUTE) {
      const authenticated = await checkUser();
      if (!authenticated) {
        dispatch(userSignedOut());
        checkFederatedCookieAndLogin(nextRouter);
      }

      //If we are on the admin page but aren't admin, skooch us off.
      if (isSuccess && nextRouter.route === ADMIN_ROUTE) {
        if (!user?.admin) {
          nextRouter.push(HOME_ROUTE);
        }
      }
    }
  };

  useEffect(() => {
    checkAuth();
  });

  return children;
}

export default RequireAuth;
