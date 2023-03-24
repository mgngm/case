import type { Organisation, Partner } from 'src/graphql';
import { getAuthHeader } from 'src/slices/api';
import { GroupType } from 'src/types/groups';

/**
 * send a POST to create a partner or org user group
 *
 * @param type GroupType
 * @param groupName string
 * @param description string
 * @returns Promise<Response>
 */
export const createGroup = async (type: GroupType, groupName: string, description?: string) => {
  // build post body
  const body = {
    groupName,
    description,
    // lower precendence value takes priority, so we want the partner to be
    // more important than the organisation group
    precedence: type === GroupType.partner ? 1 : 2,
  };

  return fetch('/api/users/groups/', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'content-type': 'application/json',
      authorization: await getAuthHeader(),
    }),
  });
};

/**
 * send a DELETE to remove a list of groups
 *
 * @param groups string[]
 * @returns Promise<Response>
 */
export const deleteGroups = async (groups: string[]) =>
  fetch('/api/users/groups/', {
    method: 'DELETE',
    body: JSON.stringify({ groups }),
    headers: new Headers({
      'content-type': 'application/json',
      authorization: await getAuthHeader(),
    }),
  });

/**
 * create a partner-level user group
 *
 * @param partner Partner
 * @returns Promise<ResponseData|null>
 */
export const createPartnerGroup = async (partner: Partner) => {
  try {
    const resp = await createGroup(GroupType.partner, partner.partnerId, partner.partnerName ?? undefined);
    const json = await resp.json();
    //anything else?
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * create an organisation-level user group
 *
 * @param organisation Organisation
 * @returns Promise<ResponseData|null>
 */
export const createOrgGroup = async (organisation: Pick<Organisation, 'organisationId' | 'organisationName'>) => {
  try {
    const resp = await createGroup(
      GroupType.organisation,
      organisation.organisationId,
      organisation.organisationName ?? undefined
    );
    const json = await resp.json();
    return json;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * delete a partner user group and it's organisation sub-groups
 *
 * @param partner
 * @returns Promise<ResponseData>
 */
export const deletePartnerGroup = async (partner: Partner) => {
  try {
    const groups = [partner.partnerId];

    // get organisation groups under partner
    for (const org of partner.organisations?.items ?? []) {
      if (org) {
        groups.push(org.organisationId);
      }
    }

    const resp = await deleteGroups(groups);
    return await resp.json();
  } catch (err) {
    console.error(err);
  }
};

/**
 * delete an organisation user group
 *
 * @param organisation
 * @returns Promise<ResponseData>
 */
export const deleteOrgGroup = async (organisation: Organisation) => {
  try {
    const group = [organisation.organisationId];
    const resp = await deleteGroups(group);
    return await resp.json();
  } catch (err) {
    console.error(err);
  }
};
