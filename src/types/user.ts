export declare enum DeliveryMediumType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export interface AttributeType {
  Name: string | undefined;
  Value?: string;
}

export interface MFAOptionType {
  DeliveryMedium?: DeliveryMediumType | string;
  AttributeName?: string;
}

export type LocalUser = {
  userSub: string;
  email: string;
  Username?: string | undefined;
  Attributes?: AttributeType[];
  UserCreateDate?: Date | undefined;
  UserLastModifiedDate?: Date | undefined;
  Enabled?: boolean | undefined;
  UserStatus?: string | undefined;
  MFAOptions?: MFAOptionType[] | undefined;
  admin?: boolean;
  sso?: boolean;
};
