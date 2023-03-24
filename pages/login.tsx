import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import QRCodeDisplay from 'qrcode.react';
import type { SubmitHandler, UseFormResetField } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import type { AppDispatch } from 'src/store';
import ActualInput from 'src/components/shared/input';
import { LoginFormState, FEDERATION_COOKIE, ACTUAL_LOGIN_KEY } from 'src/constants/auth';
import { useAppDispatch } from 'src/hooks';
import { federatedSignIn, checkUser, resetPassword, forgotPassword } from 'src/logic/client/auth';
import { initialiseUserAndRedirect, signIn, submitMFA } from 'src/slices/auth';
import type { FederationCookie, LoginFormFields } from 'src/types/auth';
import baseStyles from 'styles/Base.module.scss';
import imageStyles from 'styles/Image.module.scss';
import styles from 'styles/Login.module.scss';

const loginLogic = async (
  router: NextRouter,
  setLoginFormState: Dispatch<SetStateAction<LoginFormState>>,
  setAuthError: Dispatch<SetStateAction<string | null>>,
  dispatch: AppDispatch
) => {
  const cookies = new Cookies();
  //First we want to check if the federation cookie exists.
  const fedCookie: FederationCookie = cookies.get(FEDERATION_COOKIE);

  if (router.query.code || fedCookie) {
    setLoginFormState(LoginFormState.Loading);
  }

  const loginKey = localStorage.getItem(ACTUAL_LOGIN_KEY);

  //Check if we are logged in, and handle things if we are not.
  const loggedIn = await checkUser();
  //If we are in the middle of an sso flow (loginKey is set) and we are now logged in
  if (loggedIn && loginKey) {
    localStorage.removeItem(ACTUAL_LOGIN_KEY);
    await dispatch(initialiseUserAndRedirect(setLoginFormState, setAuthError));

    //If we are not logged in, we aren't in the middle of an sso flow but we do have a cookie available, attempt a login
  } else if (!loggedIn && !loginKey && fedCookie) {
    federatedSignIn({ provider: fedCookie?.provider }, setLoginFormState);
  } else {
    setLoginFormState(LoginFormState.Email);
  }
};

const submitFactory =
  (
    loginFormState: LoginFormState,
    setLoginFormState: Dispatch<SetStateAction<LoginFormState>>,
    setAuthError: Dispatch<SetStateAction<string | null>>,
    setAuthInfo: Dispatch<SetStateAction<string | null>>,
    setQRCode: Dispatch<SetStateAction<string | null>>,
    resetField: UseFormResetField<LoginFormFields>,
    dispatch: AppDispatch
  ): SubmitHandler<LoginFormFields> =>
  async (data, event) => {
    //Any time we submit, clear any errors/info.
    setAuthError(null);
    setAuthInfo(null);

    event?.preventDefault();

    switch (loginFormState) {
      case LoginFormState.Email: {
        federatedSignIn({ email: data.email }, setLoginFormState);
        break;
      }
      case LoginFormState.ResetPassword:
        await resetPassword(
          {
            username: data.forgotPasswordEmail || data.email,
            resetPassword: data.resetPassword,
            resetPasswordConfirm: data.resetPasswordConfirm,
            resetCode: data.resetCode,
          },
          setLoginFormState,
          setAuthError,
          setAuthInfo,
          resetField
        );

        break;
      case LoginFormState.SetFirstPassword:
        resetField('confirmPassword');
        dispatch(
          signIn(
            { username: data.email, password: data.password, confirmPassword: data.confirmPassword },
            setLoginFormState,
            setAuthError,
            setAuthInfo,
            setQRCode,
            true
          )
        );
        break;
      case LoginFormState.Password:
        dispatch(
          signIn(
            { username: data.email, password: data.password },
            setLoginFormState,
            setAuthError,
            setAuthInfo,
            setQRCode
          )
        );

        break;
      case LoginFormState.ForgotPassword:
        forgotPassword({ username: data.forgotPasswordEmail }, setLoginFormState, setAuthError);
        resetField('resetPassword');
        resetField('resetPasswordConfirm');
        resetField('resetCode');
        break;
      case LoginFormState.MFASetup:
        dispatch(
          submitMFA(
            { username: data.email, password: data.password, otp: data.otp },
            setLoginFormState,
            setAuthInfo,
            setAuthError,
            setQRCode
          )
        );
        break;
      case LoginFormState.MFA:
        dispatch(
          submitMFA(
            { username: data.email, password: data.password, otp: data.otp },
            setLoginFormState,
            setAuthInfo,
            setAuthError
          )
        );
    }
  };

const Login = () => {
  const nRouter = useRouter();
  const appDispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    resetField,
  } = useForm<LoginFormFields>();

  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);
  const [QRCode, setQRCode] = useState<string | null>(null);
  const [loginFormState, setLoginFormState] = useState(LoginFormState.Loading);
  let formContent;
  const resetLoginForm = () => {
    setAuthError(null);
    setAuthInfo(null);
    setLoginFormState(LoginFormState.Email);
  };

  //If we have been passed a 'code' as a query parameter then we've just returned from the SSO login redirect, so we should display the loading state.
  useEffect(() => {
    loginLogic(nRouter, setLoginFormState, setAuthError, appDispatch);
    //eslint-disable-next-line
  }, []);

  //If the login form state changes, we should focus the relevant input right away
  useEffect(() => {
    switch (loginFormState) {
      case LoginFormState.Email:
        setFocus('email');
        break;
      case LoginFormState.ForgotPassword:
        setFocus('email');
        setAuthError(null);
        break;
      case LoginFormState.ResetPassword:
        setFocus('email');
        resetField('resetPassword');
        resetField('resetPasswordConfirm');
        resetField('resetCode');
        break;
      case LoginFormState.SetFirstPassword:
        resetField('confirmPassword');
        setFocus('confirmPassword');
        break;
      case LoginFormState.Password:
        resetField('password');
        setFocus('password');
        break;
      case LoginFormState.MFA:
      case LoginFormState.MFASetup:
        resetField('otp');
        setFocus('otp');
        break;
    }
  }, [setFocus, loginFormState, resetField]);

  switch (loginFormState) {
    case LoginFormState.Email:
      formContent = (
        <>
          <label>Email</label>
          <ActualInput invalid={!!errors.email} type="email" {...register('email', { required: true })} />
          {errors.email && (
            <span className={styles.loginFormError}>
              Email not found. Please contact your system administrator or try again later.
            </span>
          )}
          {authError && <span className={styles.loginFormError}>{authError}</span>}
          <div className={styles.loginFormButtonWrapper}>
            <Button className={styles.loginFormButton} variant="contained" type="submit" name="login" id="login-button">
              Login
            </Button>
          </div>
        </>
      );
      break;
    case LoginFormState.ForgotPassword:
      formContent = (
        <>
          <label>Email</label>
          <ActualInput
            invalid={!!errors.forgotPasswordEmail}
            type="email"
            {...register('forgotPasswordEmail', { required: true })}
          />
          {errors.forgotPasswordEmail && (
            <span className={styles.loginFormError}>
              Email not found. Please contact your system administrator or try again later.
            </span>
          )}
          <span className={styles.info}>
            Click{' '}
            <span
              className={styles.link}
              onClick={() => {
                setLoginFormState(LoginFormState.ResetPassword);
              }}
            >
              here
            </span>{' '}
            if you have already received a code
          </span>
          {authError && <span className={styles.loginFormError}>{authError}</span>}
          <div className={styles.loginFormButtonWrapper}>
            <Button
              className={styles.loginFormButton}
              variant="contained"
              type="submit"
              name="Forgot Password"
              id="reset-password-button"
            >
              Reset Password
            </Button>
            <Button
              className={styles.loginFormButton}
              variant="outlined"
              id="login-page-back-button"
              onClick={() => {
                resetLoginForm();
              }}
            >
              Back
            </Button>
          </div>
        </>
      );
      break;
    case LoginFormState.Password:
      formContent = (
        <>
          <label>Password</label>
          <ActualInput invalid={!!errors.password} {...register('password', { required: true })} type="password" />
          {errors.password && (
            <span className={styles.loginFormError}>
              Wrong password, try again or click &lsquo;Reset Password&lsquo; below to reset it.
            </span>
          )}
          {authError && <span className={styles.loginFormError}>{authError}</span>}
          <div className={styles.loginFormButtonWrapper}>
            <Button className={styles.loginFormButton} variant="contained" type="submit" name="login" id="login-button">
              Login
            </Button>
            <Button
              className={styles.loginFormButton}
              id="login-page-back-button"
              variant="outlined"
              onClick={() => resetLoginForm()}
            >
              Back
            </Button>
          </div>
        </>
      );
      break;
    case LoginFormState.SetFirstPassword:
      formContent = (
        <>
          <label>Confirm new password</label>
          <ActualInput
            invalid={!!errors.password}
            {...register('confirmPassword', { required: true })}
            type="password"
          />
          {errors.confirmPassword && (
            <span className={styles.loginFormError}>
              Wrong password, try again or click &lsquo;Reset Password&lsquo; below to reset it.
            </span>
          )}
          {authError && <span className={styles.loginFormError}>{authError}</span>}
          <div className={styles.loginFormButtonWrapper}>
            <Button className={styles.loginFormButton} variant="contained" type="submit" name="login" id="login-button">
              Login
            </Button>
            <Button className={styles.loginFormButton} variant="outlined" onClick={() => resetLoginForm()}>
              Back
            </Button>
          </div>
        </>
      );
      break;
    case LoginFormState.ResetPassword:
      formContent = (
        <>
          <p className={styles.info}>
            Your password has been set to reset, you should have received an email containing your verification code.
            Please enter your email and verification code to continue:{' '}
          </p>
          <label id="email-label">Email</label>
          <ActualInput
            invalid={!!errors.forgotPasswordEmail}
            type="email"
            {...register('forgotPasswordEmail', { required: true })}
          />
          <label id="2fa-code-label">Verification Code:</label>
          <ActualInput invalid={!!errors.resetCode} {...register('resetCode', { required: true })} />
          {errors.resetCode && <span className={styles.loginFormError}>Please input a valid reset code.</span>}
          <label id="new-password-label">New Password:</label>
          <ActualInput
            invalid={!!errors.resetPassword}
            {...register('resetPassword', { required: true })}
            type="password"
          />
          <label id="confirm-new-password-label">Confirm New Password:</label>
          <ActualInput
            invalid={!!errors.resetPasswordConfirm}
            {...register('resetPasswordConfirm', {
              required: true,
            })}
            type="password"
          />
          {authError && <span className={styles.loginFormError}>{authError}</span>}
          <div className={styles.loginFormButtonWrapper}>
            <Button className={styles.loginFormButton} variant="contained" type="submit" name="Reset">
              Submit
            </Button>
            <Button
              id="login-page-back-button"
              variant="outlined"
              className={styles.loginFormButton}
              onClick={() => resetLoginForm()}
            >
              Back
            </Button>
          </div>
        </>
      );
      break;
    //Double state here if you need to differentiate going forward.
    case LoginFormState.Federation:
    case LoginFormState.Loading:
      formContent = <span className={styles.info}>Attempting to log you in...</span>;
      break;
    case LoginFormState.MFA:
    case LoginFormState.MFASetup:
      formContent = (
        <>
          {QRCode && (
            <div className={styles.qrCode}>
              <QRCodeDisplay value={QRCode} />
            </div>
          )}
          <label>Authenticator Code:</label>
          <ActualInput invalid={!!errors.otp} {...register('otp', { required: true })} />
          {authError && <span className={styles.loginFormError}>{authError}</span>}
          <Button className={styles.loginFormButton} variant="contained" type="submit" name="Submit">
            Submit
          </Button>
          <Button className={styles.loginFormButton} variant="outlined" onClick={() => resetLoginForm()}>
            Back
          </Button>
        </>
      );
      break;
  }

  return (
    <>
      <Head>
        <title>Login - Actual Experience</title>
      </Head>
      <div className={styles.loginScreen}>
        <div className={styles.loginFormWrapper}>
          <div className={imageStyles.loginLogo}>
            <Image alt="Actual Experience" src="/assets/login/logo.svg" layout="fill" objectFit="contain" priority />
          </div>
          <form
            className={styles.loginForm}
            onSubmit={handleSubmit(
              submitFactory(
                loginFormState,
                setLoginFormState,
                setAuthError,
                setAuthInfo,
                setQRCode,
                resetField,
                appDispatch
              )
            )}
          >
            <span className={styles.info}>{authInfo}</span>
            {formContent}
          </form>
        </div>

        <div className={styles.resetPasswordWrapper}>
          Forgot your password?{' '}
          <span
            className={baseStyles.link}
            onClick={() => {
              setLoginFormState(LoginFormState.ForgotPassword);
              setAuthInfo('Please enter your email address to reset your password');
            }}
          >
            Reset password
          </span>
        </div>
        <div className={styles.termsAndConditions}>
          <div className={styles.tocMain}>
            Please read our current{' '}
            <Link href="https://actual-experience.com/resources/ui-terms-of-use/" passHref={true}>
              User Interface Terms of Use
            </Link>{' '}
            and{' '}
            <Link href="https://actual-experience.com/resources/privacy/" passHref={true}>
              Privacy Notice
            </Link>
            , which govern your use of the User Interface. Do not use the User Interface if you do not agree with these
            terms and policies. We use temporary cookies to help control your session and improve your experience. By
            logging in, you are agreeing to accept the cookies we use. The cookies we use are{' '}
            <Link href="https://actual-experience.com/resources/cookies/" passHref={true}>
              explained here
            </Link>
            .
          </div>
          <div className={styles.tocSub}>© Actual Experience {new Date().getFullYear()}</div>
        </div>
      </div>
    </>
  );
};

export default Login;
