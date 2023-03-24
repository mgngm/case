import type { RSA } from 'jwk-to-pem';

export interface Credentials {
  username: string;
  password: string;
  //We can add extra stuff to the credenetials object later on if we need, tokens, roles etc.
  confirmPassword?: string;
  otp?: string;
}

export interface ForgotPasswordCredentials {
  username: string;
  resetPassword: string;
  resetPasswordConfirm: string;
  resetCode: string;
}
export interface Tokens {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  userToken: string;
}

export interface FederationCookie {
  provider: string;
}

export interface RS256 extends RSA {
  alg: string;
  kid: string;
  use: string;
}

export type AWSJWK = { keys: RS256[] };

export type LoginFormFields = {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
  resetPassword: string;
  resetPasswordConfirm: string;
  resetCode: string;
  forgotPasswordEmail: string;
};
