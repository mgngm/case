import type { EntityState } from '@reduxjs/toolkit';
import { TESSERACT_ADMIN_GROUP_NAME } from 'src/constants/admin';
import { ApiMethods } from 'src/constants/api';
import { ORGANISATION, PARTNER } from 'src/constants/datastore';
import { GLOBAL_CONTEXT } from 'src/constants/slices';
import { AccessLevel } from 'src/graphql';
import type { Partner, Organisation } from 'src/graphql';
import { methodHandlers } from 'src/logic/server';
import { userGroupAction } from 'src/logic/server/auth';
import {
  buildContextsForGroups,
  getContextForIdp,
  getOrganisation,
  getOrganisationsForPartner,
  getPartner,
} from 'src/logic/server/context';
import { listAllGroups } from 'src/logic/server/groups';
import { getGroupsForUser, getUser } from 'src/logic/server/users';
import { orgAdapter, partnerAdapter, selectOrgById } from 'src/slices/context';
import type { ContextEntityState } from 'src/slices/context';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder
    .get<
      ResponseData<{
        userSub: string;
        [ORGANISATION]: EntityState<Organisation>;
        [PARTNER]: EntityState<Partner>;
      }>
    >(async (req, res, { tokens, failWithCode }) => {
      let { userSub } = req.query;

      if (Array.isArray(userSub)) {
        userSub = userSub[0];
      }

      if (!userSub) {
        throw failWithCode('No user sub found', 404);
      }

      // get user via filter on list
      const user = await getUser(userSub, tokens);

      if (!user) {
        throw failWithCode('No user found', 404);
      }

      const { Username: username } = user;

      if (!username) {
        throw new Error(`Could not get username for user ${userSub}`);
      }

      const returnMap: ContextEntityState = {
        accessLevel: AccessLevel.ORGANISATION,
        [ORGANISATION]: orgAdapter.getInitialState(),
        [PARTNER]: partnerAdapter.getInitialState(),
      };

      // get groups for user
      const groups = await getGroupsForUser(username, tokens);

      console.log('User groups found, number found:', groups.length);
      // build context list
      for (const group of groups) {
        let groupName: string | string[] | undefined = group.GroupName;
        if (groupName === TESSERACT_ADMIN_GROUP_NAME) {
          continue;
        }
        if (group.Description?.includes('Autogenerated group')) {
          // get idp from user
          const idp = JSON.parse(user.Attributes?.find((a) => a.Name === 'identities')?.Value ?? '[]')[0]?.providerName;

          if (!idp) {
            throw new Error('Could not get identity provider for user');
          }

          // lookup group name in ContextMap table
          const idpContext = await getContextForIdp(idp, tokens);
          if (idpContext) {
            groupName = idpContext.context ?? undefined;
            console.log('Auto Generated Group Found - IDP/MappedGroup:', idp, idpContext, groupName);
          }
        }

        //If nothing then just break out
        if (!groupName) {
          break;
        }

        //IDP Mapping table now only returns one context, so we don't need to loop anymore.
        if (groupName === GLOBAL_CONTEXT) {
          returnMap.accessLevel = AccessLevel.GLOBAL;
          //If we are in a global context, we want to construct a list of all partners and orgs

          //Fetch all groups from COGNITO (Source of truth for groups)
          const allGroups = (await listAllGroups(tokens)) ?? [];

          //Using these groups, search the database for all available contexts and set them in the map.
          const ctx = await buildContextsForGroups(allGroups, tokens);
          returnMap[ORGANISATION] = orgAdapter.addMany(returnMap[ORGANISATION], ctx[ORGANISATION]);
          returnMap[PARTNER] = partnerAdapter.addMany(returnMap[PARTNER], ctx[PARTNER]);

          // we've built all the contexts we can build so break out of the loop
          break;
        } else if (groupName?.includes('/')) {
          //If we are looking at an organisation level group
          // lookup context in Organisation table
          const org = await getOrganisation(groupName, null, tokens);
          //If the org already exists in our list of contexts, don't add it to the list.
          if (!selectOrgById(returnMap[ORGANISATION], org.id)) {
            returnMap[ORGANISATION] = orgAdapter.addOne(returnMap[ORGANISATION], org);
          }
        } else {
          //If we are global we don't want to go back down to partner.
          if (returnMap.accessLevel !== AccessLevel.GLOBAL) {
            returnMap.accessLevel = AccessLevel.PARTNER;
          }
          // lookup context in Partner table
          const partner = await getPartner(groupName, tokens);

          let orgs: Organisation[] = [];
          // get all organisations for partner and add to list, if none, add none.
          try {
            orgs = await getOrganisationsForPartner(partner.id, tokens);

            returnMap[ORGANISATION] = orgAdapter.addMany(returnMap[ORGANISATION], orgs);
          } catch {
            console.log(`No orgs found for ${partner.partnerId}`);
          }

          returnMap[PARTNER] = partnerAdapter.addOne(returnMap[PARTNER], partner);
        }
      }

      return { ok: true, data: { userSub, ...returnMap } };
    })
    .post(async (req, res, { tokens }) => {
      const { userSub } = req.query;
      const { currentContext, newContext } = req.body;
      if (userSub && typeof userSub === 'string') {
        if (currentContext !== undefined) {
          await userGroupAction({ userName: userSub, groupName: currentContext, action: ApiMethods.DELETE }, tokens);
        }
        await userGroupAction({ userName: userSub, groupName: newContext, action: ApiMethods.ADD }, tokens);
        return { ok: true };
      }
    });
});
