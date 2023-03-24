import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
  DeleteGroupCommand,
  ListGroupsCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import aws from 'src/aws-exports';
import { CognitoIdentityProviderPaginatedListQuery } from 'src/logic/server';

/**
 * Lists all cognito group names for provided contexts
 * @param contexts  - Contexts to look for corresponding cognito group
 * @param idpClient - Optional client for memory optimisation
 * @returns [string] - list of cognito groups.
 */
export const listGroupsForContext = async (
  contexts: string[] | Set<string>,
  idpClient?: CognitoIdentityProviderClient
) => {
  const groups = new Set<string>([]);

  const client =
    idpClient ??
    new CognitoIdentityProviderClient({
      region: aws.aws_cognito_region,
      maxAttempts: 10,
    });

  //We will list ALL groups we have in congnito and then grab the ones we care about. we do this just in case something weird comes to this lambda and we try to torch an unmade group or something odd.
  try {
    console.log(`Fetching Cognito Groups for validation...`);
    const allGroups = await CognitoIdentityProviderPaginatedListQuery({
      command: ListGroupsCommand,
      input: { UserPoolId: aws.aws_user_pools_id, Limit: 60 },
      resKey: 'Groups',
      idpClient: client,
    });

    for (const _ctx of contexts) {
      console.log(`Validating ${_ctx} is a proper cognito group...`);
      const contextMeta = allGroups.find((_g) => _g.GroupName === _ctx) ?? undefined;
      if (contextMeta) {
        groups.add(_ctx);
      } else {
        console.log(`FAIL - Could not find cognito group for Context: ${_ctx}`);
      }
    }
  } catch (e) {
    console.error(e);
  }
  return groups;
};

/**
 * Deletes provided groups from Cognito
 * @param groups  - Groups to delete
 * @param idpClient  - Optional client for memory optimisation
 */
export const deleteCognitoGroups = async (groups: string[] | Set<string>, idpClient: CognitoIdentityProviderClient) => {
  console.log(`Deleting Cognito Groups...`);
  const client =
    idpClient ??
    new CognitoIdentityProviderClient({
      region: aws.aws_cognito_region,
      maxAttempts: 10,
    });

  for (const group of groups) {
    try {
      console.log(`Attempting to delete ${group}...`);
      const command = new DeleteGroupCommand({
        UserPoolId: aws.aws_user_pools_id,
        GroupName: group,
      });

      await client.send(command);
    } catch (err) {
      console.error(err);
      continue;
    }
  }
};

/**
 * Lists users in all provided cognito groups
 * @param contexts Groups to check
 * @param idpClient - optional idp client
 * @returns
 */
export const listUsersInContexts = async (
  contexts: string[] | Set<string>,
  idpClient?: CognitoIdentityProviderClient
) => {
  const users = new Set<string>([]);
  const client =
    idpClient ??
    new CognitoIdentityProviderClient({
      region: aws.aws_cognito_region,
      maxAttempts: 10,
    });

  for (const _ctx of contexts) {
    console.log(`Attempting to list users in context: ${_ctx}`);
    const contextUsers = await CognitoIdentityProviderPaginatedListQuery({
      command: ListUsersInGroupCommand,
      input: {
        UserPoolId: aws.aws_user_pools_id,
        GroupName: _ctx,
      },
      resKey: 'Users',
      idpClient: client,
    });

    for (const _ctxUser of contextUsers) {
      _ctxUser.Username && users.add(_ctxUser.Username);
    }
  }

  return users;
};

/**
 * Deletes all provided cognito users PERMANENTLY.
 * @param users - Users to be removed
 * @param idpClient - Optional client.
 */
export const deleteCognitoUsers = async (users: string[] | Set<string>, idpClient?: CognitoIdentityProviderClient) => {
  console.log(`Deleting Cognito Users...`);
  const client =
    idpClient ??
    new CognitoIdentityProviderClient({
      region: aws.aws_cognito_region,
      maxAttempts: 10,
    });

  for (const _user of users) {
    try {
      //If we have multiple user pools for different clients, we'll need to change this.
      const command = new AdminDeleteUserCommand({
        UserPoolId: aws.aws_user_pools_id,
        Username: _user,
      });
      console.log(`Attemping to delete ${_user} from cognito...`);
      await client.send(command);
    } catch (e) {
      console.error(e);
      continue;
    }
  }
};
