import {
  CognitoIdentityProviderClient,
  CreateGroupCommand,
  DeleteGroupCommand,
  ListGroupsCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import type { CreateGroupCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import aws from 'src/aws-exports';
import { CognitoIdentityProviderPaginatedListQuery } from 'src/logic/server';
import type { Tokens } from 'src/types/auth';
import type { Group } from 'src/types/groups';

export const createGroup = async (groupData: Group, tokens: Tokens): Promise<Group> => {
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  try {
    const client = new CognitoIdentityProviderClient(creds);

    const command = new CreateGroupCommand({
      UserPoolId: aws.aws_user_pools_id,
      Description: groupData.description,
      GroupName: groupData.groupName,
      Precedence: groupData.precedence,
    });

    const response: CreateGroupCommandOutput = await client.send(command);

    if (response.Group && response.Group.CreationDate && response.Group.GroupName) {
      return {
        createdAt: response.Group.CreationDate,
        groupName: response.Group.GroupName,
        description: response.Group.Description,
        precedence: response.Group.Precedence,
      };
    }

    // no idea of the content of response if the group isn't created - does it throw itself?
    // CreateGroupCommandOuptut is just { $metadata, Group }, so $metadata might include something
    // useful if it doesn't throw on error
    throw new Error(JSON.stringify(response));
  } catch (err) {
    console.error(err);
    throw new Error('Error creating group');
  }
};

export const deleteGroups = async (groups: string[], tokens: Tokens) => {
  const creds = {
    region: aws.aws_cognito_region,
    credentials: tokens,
    maxAttempts: 10,
  };

  const client = new CognitoIdentityProviderClient(creds);

  const success = [];
  const fail = [];

  for (const group of groups) {
    try {
      const command = new DeleteGroupCommand({
        UserPoolId: aws.aws_user_pools_id,
        GroupName: group,
      });

      await client.send(command);
      success.push(group);
    } catch (err) {
      console.error(err);
      fail.push(group);
    }
  }

  return { success, fail };
};

export const listAllGroups = async (tokens: Tokens) => {
  try {
    const allGroups = await CognitoIdentityProviderPaginatedListQuery({
      tokens,
      command: ListGroupsCommand,
      input: { UserPoolId: aws.aws_user_pools_id, Limit: 60 },
      resKey: 'Groups',
    });
    return allGroups;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
