import {
  CognitoIdentityProviderClient,
  AdminListGroupsForUserCommand,
  ListUsersInGroupCommand,
  ListUsersCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import type {
  UserType,
  AdminDeleteUserCommandInput,
  GroupType,
  AdminUpdateUserAttributesCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import aws from 'src/aws-exports';
import { TESSERACT_ADMIN_GROUP_NAME } from 'src/constants/admin';
import { COGNITO_DEFAULT_CONTEXT_ATTRIBUTE } from 'src/constants/auth';
import { CONTEXT_MAP_TABLE } from 'src/constants/datastore';
import { CognitoIdentityProviderPaginatedListQuery } from 'src/logic/server';
import { scanDynamoTable } from 'src/logic/server/dynamo';
import type { Tokens } from 'src/types/auth';

/**
 * Deletes a user from cognito
 * @param {string} username - user to be deleted (USER SUB ALSO WORKS HERE!!!!!)
 * @param {Tokens} tokens - creds
 * @returns void
 */
export const deleteCognitoUser = async (username: string, tokens: Tokens) => {
  if (!username) {
    return;
  }

  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    const client = new CognitoIdentityProviderClient(creds);
    const commandInput: AdminDeleteUserCommandInput = {
      UserPoolId: aws.aws_user_pools_id,
      Username: username,
    };

    const command = new AdminDeleteUserCommand(commandInput);

    await client.send(command);
  } catch (e) {
    console.error('Unable to delete user', username, e);
  }
};

/**
 * map user command output to something useful
 *
 * @param usersResponse command output from list users or list users in group
 * @returns list of user objects as a union of UserType and explicitely called out keys
 */
const mapListResponse = (users: UserType[]) =>
  users.map((_user) => {
    const attributes = _user.Attributes?.reduce<Record<string, string | undefined>>((obj, at) => {
      if (at.Name) {
        obj[at.Name] = at.Value;
      }
      return obj;
    }, Object.create({}));

    return {
      ..._user,
      userSub: attributes?.sub ?? '',
      email: attributes?.email ?? '',
    };
  });

/**
 * Adds admin flag to all users within current context that belong to the admin group.
 * @param contextUsers - users in current context
 * @param adminUsers - users in admin group
 * @returns - transformed list.
 */
const transformUserDataForAdminFlag = async (contextUsers: UserType[], tokens: Tokens) => {
  //We've been given a list of contextual users, so fetch the admin users to compare.

  const adminUsers = await CognitoIdentityProviderPaginatedListQuery({
    tokens: tokens,
    command: ListUsersInGroupCommand,
    input: {
      UserPoolId: aws.aws_user_pools_id,
      GroupName: TESSERACT_ADMIN_GROUP_NAME,
    },
    resKey: 'Users',
  });

  const returnUsers = contextUsers.map((user) => {
    const index = adminUsers.findIndex((adminUser) => adminUser.Username === user.Username);
    return {
      ...user,
      admin: index > -1,
      //Add sso flag.
      sso: user.UserStatus === 'EXTERNAL_PROVIDER',
    };
  });

  return returnUsers;
};

/**
 * list all users in the user pool
 *
 * @param tokens Tokens
 * @param filter optional filter string for the command
 * @returns list of users
 */
export const listAllUsers = async (tokens: Tokens, filter?: string) => {
  try {
    const users = await CognitoIdentityProviderPaginatedListQuery({
      tokens: tokens,
      command: ListUsersCommand,
      input: {
        UserPoolId: aws.aws_user_pools_id,
        ...(filter && { Filter: filter }),
      },
      resKey: 'Users',
    });

    const usersWithAdminFlag = await transformUserDataForAdminFlag(users, tokens);
    return mapListResponse(usersWithAdminFlag);
  } catch (e) {
    throw new Error('error fetching users');
  }
};

/**
 * gets a list of users in a particular context
 *
 * if context is a partner, all users in that partner's organisations
 * are returned also
 *
 * @param context partnerId or organisationId (in the form pid/oid)
 * @param tokens Tokens
 * @returns list of users
 */
export const listUsersInContext = async (context: string, tokens: Tokens) => {
  //We can get all users in the current group, great!
  try {
    const contextCommandInput = {
      UserPoolId: aws.aws_user_pools_id,
      GroupName: context,
    };

    //We need to check if there is an SSO group attached to this context.
    const queryParams = {
      ExpressionAttributeNames: { '#key': 'context', '#defaultKey': 'defaultContext' },
      ExpressionAttributeValues: { ':value': context },
      FilterExpression: '#key = :value or #defaultKey = :value',
      ReturnConsumedCapacity: 'TOTAL',
    };

    const contextMappingQuery = await scanDynamoTable(CONTEXT_MAP_TABLE, queryParams, tokens);

    //We want to get all users in this group first
    const contextUsers = await CognitoIdentityProviderPaginatedListQuery({
      tokens: tokens,
      command: ListUsersInGroupCommand,
      input: contextCommandInput,
      resKey: 'Users',
    });

    // prettier-ignore
    if ((contextMappingQuery.Items?.length || 0) > 0) {
      //If we have available context providers we should go and find them and get those users too.
      for (const idp of contextMappingQuery.Items || []) {
        try {
          //Create the autogenerated group name
          const groupName = `${aws.aws_user_pools_id}_${idp.identityProvider}`;
          const idpCommandInput = {
            UserPoolId: aws.aws_user_pools_id,
            GroupName: groupName,
          };

          //Get all users in this context and concat it with the users array (We will filter any duplicates);
          const idpUsers = await CognitoIdentityProviderPaginatedListQuery({
            tokens: tokens,
            command: ListUsersInGroupCommand,
            input: idpCommandInput,
            resKey: 'Users',
          });

          //Add these users to the array, we will filter them when we're through this.
          contextUsers.push(...(idpUsers ?? []));
        } catch (e) {
          console.error('Could not get idp users for idp', idp.identityProvider);
          continue;
        }
      }
    }

    const usernameMap: Record<string, true> = {};
    const filteredContextUsers: UserType[] = [];
    //Make sure we have no duplicates (just in case someone added an SSO user to another group etc. etc.)
    for (const _user of contextUsers) {
      if (!usernameMap[_user.Username as string]) {
        filteredContextUsers.push(_user);
        usernameMap[_user.Username as string] = true;
      }
    }

    //See which users are admin, and set the flag accordingly.
    const contextUsersWithAdminFlag = await transformUserDataForAdminFlag(filteredContextUsers, tokens);
    return mapListResponse(contextUsersWithAdminFlag);
  } catch (e) {
    console.log(e);
    throw new Error('error fetching users');
  }
};

/**
 * Get a user given their user ID (or sub)
 *
 * uses a filter on listAllUsers to select just the user
 * which matches the given sub value
 *
 * @param userSub - sub attribute for a user
 * @param tokens - Tokens
 * @returns Promise<UserType|null>
 */
export const getUser = async (userSub: string, tokens: Tokens) => {
  const filter = `sub = "${userSub}"`;
  const users = await listAllUsers(tokens, filter);

  if (users && users.length > 0) {
    return users[0];
  }

  return null;
};

/**
 * Get a list of groups for a user given their username
 *
 * @param username - Username from a AWS UserType
 * @param tokens Tokens
 * @returns Promise<GroupType[] | null>
 */
export const getGroupsForUser = async (username: string, tokens: Tokens) => {
  try {
    const groupListCommandInput = { Username: username, UserPoolId: aws.aws_user_pools_id };
    const groups = await CognitoIdentityProviderPaginatedListQuery({
      tokens: tokens,
      command: AdminListGroupsForUserCommand,
      input: groupListCommandInput,
      resKey: 'Groups',
    });

    //Sort the groups by precedence here because why not
    // we've only just created this array so should be fine to mutate
    if (groups.length > 0) {
      return groups.sort(
        (a: GroupType, b: GroupType) =>
          (a.Precedence ?? Number.MAX_SAFE_INTEGER) - (b.Precedence ?? Number.MAX_SAFE_INTEGER)
      );
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Updates user default context.
 * @param username - user to be updated
 * @param defaultContext - new default context
 * @param tokens - auth tokens.
 */
export const updateUserDefaultContext = async (username: string, defaultContext: string, tokens: Tokens) => {
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    const client = new CognitoIdentityProviderClient(creds);

    const commandInput: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: aws.aws_user_pools_id,
      Username: username,
      UserAttributes: [{ Name: COGNITO_DEFAULT_CONTEXT_ATTRIBUTE, Value: defaultContext }],
    };

    await client.send(new AdminUpdateUserAttributesCommand(commandInput));
  } catch (e) {
    throw new Error(e as string);
  }
};
