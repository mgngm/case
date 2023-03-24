export enum GroupType {
  partner,
  organisation,
}

export type Group = {
  groupName: string;
  description: string | undefined;
  precedence?: number;
  createdAt?: Date;
};

export type AWSGroup = {
  GroupName?: string;
  UserPoolId?: string;
  Description?: string;
  RoleArn?: string;
  Precedence?: number;
  LastModifiedDate?: Date;
  CreationDate?: Date;
};
