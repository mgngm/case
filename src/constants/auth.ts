export enum LoginFormState {
  Email = 'EMAIL',
  Password = 'PASSWORD',
  Loading = 'LOADING',
  Federation = 'FEDERATION',
  SetFirstPassword = 'SET_FIRST_PASSWORD',
  ForgotPassword = 'FORGOT_PASSWORD',
  ResetPassword = 'RESET_PASSWORD',
  MFA = 'MFA',
  MFASetup = 'MFA_SETUP',
}

export const RESPONSE_TYPE = 'code';
export const SCOPES = ['aws.cognito.signin.user.admin', 'email', 'openid', 'phone', 'profile'];
export const FEDERATION_COOKIE = 'tesseract-federation';
export const COGNITO_DEFAULT_CONTEXT_ATTRIBUTE = 'profile';

export const ACTUAL_LOGIN_KEY = 'ae-login';

//Custom AWS Exceptions.
export const PASSWORD_RESET_REQUIRED = 'PasswordResetRequiredException';
export const CODE_EXPIRED = 'ExpiredCodeException';
export const CODE_MISMATCH = 'CodeMismatchException';
export const LIMIT_EXCEEDED = 'LimitExceededException';

export const PIPELINE_EMAIL_ADDRESS = 'no-reply+tesseracttest@actual-experience.com';
