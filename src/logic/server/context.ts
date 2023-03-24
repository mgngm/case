import type { GroupType } from '@aws-sdk/client-cognito-identity-provider';
import { v4 } from 'uuid';
import { TESSERACT_ADMIN_GROUP_NAME } from 'src/constants/admin';
import {
  CONTEXT_MAP,
  CONTEXT_MAP_TABLE,
  ORGANISATION,
  ORGANISATION_TABLE,
  PARTNER,
  PARTNER_TABLE,
} from 'src/constants/datastore';
import type { Organisation, Partner } from 'src/graphql';
import { ContextStatus } from 'src/graphql';
import { isNotDeleted, nonNullable } from 'src/logic/libs/helpers';
import { getMeta, queryDynamoTable, scanDynamoTable, uploadToDynamoTable } from 'src/logic/server/dynamo';
import type { ContextMap } from 'src/models';
import type { Tokens } from 'src/types/auth';
import type { PartnerContext } from 'src/types/context';
import type { ContextMapTableItem, OrganisationTableItem, PartnerTableItem } from 'src/types/dynamo';

export const getOrganisation = async (
  orgId: string,
  partnerContext: PartnerContext | null = null,
  tokens: Tokens,
  field = 'organisationId'
): Promise<Organisation> => {
  const queryResponse = await queryDynamoTable(
    ORGANISATION_TABLE,
    field === 'organisationId' ? 'byOrganisationId' : null,
    field,
    orgId,
    tokens
  );

  if (!queryResponse || queryResponse.Items?.length === 0) {
    throw new Error(`Could not find organisation by ID ${orgId}`);
  }

  const [org] = queryResponse.Items?.filter(isNotDeleted) ?? [];

  if (!org) {
    throw new Error(`Could not get organisation by ID ${orgId}`);
  }

  // get organisation's partner
  if (!partnerContext) {
    const partnerQuery = await queryDynamoTable(PARTNER_TABLE, null, 'id', org.partnerOrganisationsId, tokens);

    if (!partnerQuery || partnerQuery.Items?.length === 0) {
      throw new Error(`Could not find partner by ID ${org.partnerOrganisationsId}`);
    }

    const [partner] = partnerQuery.Items?.filter(isNotDeleted) ?? [];

    if (!partner) {
      throw new Error(`Could not get partner for organisation with ID ${orgId}`);
    }

    partnerContext = { partnerId: partner.partnerId, partnerName: partner.partnerName };
  }

  return org as Organisation;
};

export const getAllOrganisations = async (tokens: Tokens) => {
  const organisationScan = await scanDynamoTable(ORGANISATION_TABLE, undefined, tokens);
  if (organisationScan.Items && organisationScan.Items.length > 0) {
    return organisationScan.Items as Organisation[];
  }

  return [];
};

export const getPartner = async (partnerId: string, tokens: Tokens) => {
  const partnerQuery = await queryDynamoTable(PARTNER_TABLE, 'byPartnerId', 'partnerId', partnerId, tokens);
  if (!partnerQuery || partnerQuery.Items?.length === 0) {
    throw new Error(`Could not get partner by ID ${partnerId}`);
  }

  const [partner] = partnerQuery.Items?.filter(isNotDeleted) ?? [];
  if (!partner) {
    throw new Error(`Could not get partner by ID ${partnerId}`);
  }

  return partner as Partner;
};

export const getAllPartners = async (tokens: Tokens) => {
  const partnerScan = await scanDynamoTable(PARTNER_TABLE, undefined, tokens);
  if (partnerScan.Items && partnerScan.Items.length > 0) {
    return partnerScan.Items as Partner[];
  }

  return [];
};

export const createPartner = (
  id: string,
  { partnerId, partnerName }: PartnerContext,
  organisations: string[] = [],
  tokens: Tokens
) => {
  const partner: PartnerTableItem = {
    ...getMeta(new Date(), PARTNER),
    id: id || v4(),
    partnerId,
    partnerName,
    status: ContextStatus.CREATED,
    organisations,
  };

  return uploadToDynamoTable([partner], PARTNER_TABLE, tokens);
};

export const createOrganisation = (
  id: string,
  { organisationId, organisationName }: { organisationName: string; organisationId: string },
  dynamoPartnerId: string,
  tokens: Tokens
) => {
  const org: OrganisationTableItem = {
    ...getMeta(new Date(), ORGANISATION),
    id: id || v4(),
    organisationId,
    organisationName,
    status: ContextStatus.CREATED,
    partnerOrganisationsId: dynamoPartnerId,
  };

  return uploadToDynamoTable([org], ORGANISATION_TABLE, tokens);
};

export const createPartnerAndOrganisation = async (
  partner: PartnerContext,
  org: { organisationName: string; organisationId: string },
  tokens: Tokens
) => {
  const dynamoPartnerId = v4();
  const dynamoOrgId = v4();

  try {
    // create org first
    const orgResult = await createOrganisation(dynamoOrgId, org, dynamoPartnerId, tokens);
    // create partner
    const partnerResult = await createPartner(dynamoPartnerId, partner, [dynamoOrgId], tokens);

    return Promise.all([partnerResult, orgResult]);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getOrganisationsForPartner = async (partnerId: string, tokens: Tokens): Promise<Organisation[]> => {
  const orgQuery = await queryDynamoTable(
    ORGANISATION_TABLE,
    'gsi-Partner.organisations',
    'partnerOrganisationsId',
    partnerId,
    tokens
  );

  if (!orgQuery || orgQuery.Items?.length === 0) {
    throw new Error(`Could not find organisations by partner ID ${partnerId}`);
  }

  const orgs = orgQuery.Items?.filter(isNotDeleted) ?? [];

  if (orgs.length === 0) {
    throw new Error(`Could not get organisations by partner ID ${partnerId}`);
  }

  return orgs as Organisation[];
};

export const getContextForIdp = async (idp: string, tokens: Tokens): Promise<ContextMap> => {
  const mapQuery = await queryDynamoTable(CONTEXT_MAP_TABLE, 'byIdentityProvider', 'identityProvider', idp, tokens);

  if (!mapQuery || mapQuery.Items?.length === 0) {
    throw new Error(`Could not find context by IDP ${idp}`);
  }

  const contexts: ContextMap[] = (mapQuery.Items?.filter(isNotDeleted) as ContextMap[]) ?? [];

  if (!contexts) {
    throw new Error(`Could not get context by IPD ${idp}`);
  }

  return contexts[0];
};

export const setContextForIdp = async (identityProvider: string, context: string, tokens: Tokens) => {
  const idpContext: ContextMapTableItem = {
    ...getMeta(new Date(), CONTEXT_MAP),
    id: v4(),
    identityProvider,
    context,
  };

  return uploadToDynamoTable([idpContext], CONTEXT_MAP_TABLE, tokens);
};

export const buildContextsForGroups = async (
  groups: GroupType[],
  tokens: Tokens
): Promise<{ [ORGANISATION]: Organisation[]; [PARTNER]: Partner[] }> => {
  // filter out sso groups and the admin group.
  const contextGroups = groups.filter(
    (group) =>
      group.Precedence &&
      !group.Description?.includes('Autogenerated group') &&
      group.GroupName !== TESSERACT_ADMIN_GROUP_NAME
  );

  // split groups into partner & org contexts
  const partnerOrgs = contextGroups.reduce(
    (po: { partners: GroupType[]; organisations: GroupType[] }, group: GroupType) => {
      if (group.GroupName?.includes('/')) {
        po.organisations.push(group);
      } else {
        po.partners.push(group);
      }
      return po;
    },
    { partners: [], organisations: [] }
  );

  // get all partners
  const allPartners = await getAllPartners(tokens);

  // get all organisations
  const allOrganisations = await getAllOrganisations(tokens);

  // map groups to contexts
  const orgContexts = partnerOrgs.organisations
    .map(({ GroupName: groupName }) => {
      if (groupName) {
        const org = allOrganisations.find(({ organisationId }) => organisationId === groupName);

        // build the context object
        return org ?? null;
      }

      return null;
    })
    .filter(nonNullable);

  const partnerContexts = partnerOrgs.partners
    .map(({ GroupName: groupName }) => {
      if (groupName) {
        const partner = allPartners.find(({ partnerId }) => partnerId === groupName);
        // build the context object
        return partner ?? null;
      }

      return null;
    })
    .filter(nonNullable);

  return { [ORGANISATION]: orgContexts, [PARTNER]: partnerContexts };
};
