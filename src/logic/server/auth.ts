import type { IncomingHttpHeaders } from 'http';
import type {
  DescribeIdentityProviderCommandOutput,
  AdminCreateUserCommandInput,
  AdminAddUserToGroupCommandInput,
  AdminRemoveUserFromGroupCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
  ListIdentityProvidersCommand,
  DescribeIdentityProviderCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminResetUserPasswordCommand,
  ListGroupsCommand,
  AdminRemoveUserFromGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { decode } from 'base-64';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import aws from 'src/aws-exports';
import { ApiMethods } from 'src/constants/api';
import { COGNITO_DEFAULT_CONTEXT_ATTRIBUTE } from 'src/constants/auth';
import { CognitoIdentityProviderPaginatedListQuery } from 'src/logic/server';
import type { Tokens, AWSJWK } from 'src/types/auth';

let jwk: AWSJWK;
let pem: string;

/**
 * Extract, decode and validate tokens from authorization header
 *
 * @param headers IncomingHttpHeaders
 * @returns tokens Tokens | null
 */
export const getAuthTokens = async (headers: IncomingHttpHeaders): Promise<Tokens | null> => {
  try {
    const encodedAuth = headers?.authorization || false;

    if (!encodedAuth) {
      throw new Error('No Authorization header fouund');
    }

    // decode the tokens and parse into an object
    const decodedTokens = decode(encodedAuth);

    if (decodedTokens === encodedAuth) {
      throw new Error('Invalid token encoding');
    }

    const tokens = JSON.parse(decodedTokens) as Tokens;
    const tokenKeys = ['secretAccessKey', 'accessKeyId', 'sessionToken', 'userToken'] as const;

    if (tokenKeys.some((key) => !(key in tokens))) {
      throw new Error(`Invalid token signature: ${Object.keys(tokens)}`);
    }

    if (tokenKeys.some((key) => !tokens[key])) {
      throw new Error('Missing token values');
    }

    /* develblock:start */
    if (process.env.NEXT_PUBLIC_AMPLIFY_MOCK === '1') {
      return tokens;
    }
    /* develblock:end */

    // if we are logging in, we don't have a token to validate against, so return the tokens
    // and let downstream services reject if the other credentials are invalid
    const loginFlow = headers['x-login-flow'] === '1';
    if (tokens.userToken === 'LOGGING_IN' && loginFlow) {
      return tokens;
    }

    // find key id for token
    const [headerEncoded] = tokens.userToken.split('.');
    const headerBuffer = Buffer.from(headerEncoded, 'base64');
    const headerText = headerBuffer.toString('ascii');
    const tokenHeader = JSON.parse(headerText);

    // if we don't have the jwk, fetch it and convert it to a pem we can use to verify
    if (!jwk || !pem) {
      console.log('attempting to get jwk');

      const resp = await fetch(
        `https://cognito-idp.${aws.aws_cognito_region}.amazonaws.com/${aws.aws_user_pools_id}/.well-known/jwks.json`
      );

      jwk = await resp.json();

      if (jwk) {
        console.log('jwk fetch successful');
        const key = jwk.keys.find((k) => k.kid === tokenHeader.kid);

        if (key) {
          pem = jwkToPem(key);
        }
      } else {
        throw new Error('could not get jwk');
      }
    }

    if (!pem) {
      throw new Error('could not find jwk for token');
    }

    // verify the JWT with the PEM created from the JWK
    await new Promise((resolve, reject) =>
      jwt.verify(tokens.userToken, pem, (err: unknown, decodedJwt: unknown) => {
        if (err) {
          console.error('jwt verification failed with', err);
          reject(err);
        }
        console.log('jwt verification successful');
        resolve(decodedJwt);
      })
    );

    return tokens;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * Fetches identity providers for cognito user pool and creates a map so we can get the names based on domains.
 * @param tokens - Authorization tokens to access idp lists
 */
export async function createIdentityProvidersMap(tokens: Tokens): Promise<Record<string, string>> {
  const identityProviders: Record<string, string> = {};

  //Create our credentials object
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    const client = new CognitoIdentityProviderClient(creds);

    const providers = await CognitoIdentityProviderPaginatedListQuery({
      tokens,
      command: ListIdentityProvidersCommand,
      input: {
        UserPoolId: aws.aws_user_pools_id,
        MaxResults: 60,
      },
      resKey: 'Providers',
    });

    await Promise.all(
      providers.map(async (provider) => {
        const describeCommand = new DescribeIdentityProviderCommand({
          UserPoolId: aws.aws_user_pools_id,
          ProviderName: provider.ProviderName,
        });

        const idpDescription: DescribeIdentityProviderCommandOutput = await client.send(describeCommand);
        const domain = idpDescription.IdentityProvider?.IdpIdentifiers?.[0] || null;

        if (domain) {
          identityProviders[domain] = provider?.ProviderName ?? '';
        }
      }) ?? []
    );
  } catch (e) {
    throw new Error(`There was a problem creating your list of identity providers. ${e}`);
  }

  return identityProviders;
}

/**
 * Checks currently provided domain against list of identity providers directly from AWS to see if it has a valid identity provider
 *
 * @param domain - domain to check for
 * @param tokens - Authorisation tokens to fetch from aws things
 * @returns string | null - provider if available or null if not.
 */
export async function checkIdp(domain: string, tokens: Tokens) {
  let provider;
  try {
    const identityProviders = await createIdentityProvidersMap(tokens);
    provider = identityProviders[domain] || null;
  } catch (err) {
    //If it dies, set it to null
    console.error('no identity providers');
    console.error(err);
    provider = null;
  }

  return provider;
}

/**
 * Creates a user on Amazon Cognito in the current user pool, and adds the user to any relevant user groups.
 * @param email {string} - the email of the user to be created
 * @param context {string} - the app context in which the user is to be created
 * @param tokens {Tokens} - Cognito auth tokens.
 */
export async function createUser(
  email: string,
  context: string,
  defaultContext: string,
  tokens: Tokens,
  temporaryPassword: string | undefined = undefined
) {
  //Create our credentials object
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    //First find the group that we want our user to be added to, only create the user if it exists.
    const groups = await CognitoIdentityProviderPaginatedListQuery({
      tokens: tokens,
      command: ListGroupsCommand,
      input: {
        UserPoolId: aws.aws_user_pools_id,
        Limit: 60,
      },
      resKey: 'Groups',
    });

    //We need to find the groups that match the context we have provided

    //However if we have been provided a partner level context (no slash) we need to add to all groups under that partner
    const userGroup = groups.find((group) => group.GroupName === context) || undefined;

    //If we have found a group, then we can create the user and add them to it.
    if (userGroup) {
      const client = new CognitoIdentityProviderClient(creds);

      //If we have multiple user pools for different clients, we'll need to change this.
      const params: AdminCreateUserCommandInput = {
        UserPoolId: aws.aws_user_pools_id,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: COGNITO_DEFAULT_CONTEXT_ATTRIBUTE, Value: defaultContext },
        ],
      };

      //Used for bootstrap.
      if (temporaryPassword) {
        params.TemporaryPassword = temporaryPassword;
      }

      //Create the command and fire it off.
      const createUserCommand = new AdminCreateUserCommand(params);
      await client.send(createUserCommand);

      //Now add the user to the relevant user group
      const addToGroupCommand = new AdminAddUserToGroupCommand({
        Username: email,
        UserPoolId: aws.aws_user_pools_id,
        GroupName: userGroup.GroupName,
      });
      await client.send(addToGroupCommand);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function deleteUser(email: string, tokens: Tokens) {
  //Create our credentials object
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    const client = new CognitoIdentityProviderClient(creds);
    //If we have multiple user pools for different clients, we'll need to change this.
    const command = new AdminDeleteUserCommand({
      UserPoolId: aws.aws_user_pools_id,
      Username: email,
    });

    await client.send(command);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function resetUser(email: string, tokens: Tokens) {
  //Create our credentials object
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    const client = new CognitoIdentityProviderClient(creds);
    //If we have multiple user pools for different clients, we'll need to change this.
    const command = new AdminResetUserPasswordCommand({
      UserPoolId: aws.aws_user_pools_id,
      Username: email,
    });

    await client.send(command);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function userGroupAction(
  { userName, groupName, action }: { userName: string; groupName: string; action: ApiMethods },
  tokens: Tokens
) {
  //Create our credentials object
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    const client = new CognitoIdentityProviderClient(creds);
    //If we have multiple user pools for different clients, we'll need to change this.

    const options: AdminAddUserToGroupCommandInput | AdminRemoveUserFromGroupCommandInput = {
      Username: userName,
      UserPoolId: aws.aws_user_pools_id,
      GroupName: groupName,
    };

    const command =
      action === ApiMethods.ADD
        ? new AdminAddUserToGroupCommand(options)
        : new AdminRemoveUserFromGroupCommand(options);
    await client.send(command);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
