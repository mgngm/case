import { TESSERACT_ADMIN_GROUP_NAME } from 'src/constants/admin';
import { ApiMethods } from 'src/constants/api';
import { GLOBAL_CONTEXT } from 'src/constants/slices';
import { methodHandlers } from 'src/logic/server';
import { createUser, userGroupAction } from 'src/logic/server/auth';
import { createPartnerAndOrganisation, setContextForIdp } from 'src/logic/server/context';
import { createGroup } from 'src/logic/server/groups';
import type { ResponseData } from 'src/types/api';
import type { Tokens } from 'src/types/auth';

export default methodHandlers(
  (builder) => {
    if (process.env.INTERNAL_APIS_ENABLED) {
      builder.post<ResponseData>(async (req, res, { failWithCode }) => {
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_SESSION_TOKEN) {
          throw failWithCode('Tokens not provided', 401);
        }

        const tokens: Tokens = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          sessionToken: process.env.AWS_SESSION_TOKEN,
          userToken: '~~unused~~',
        };

        const success = [];
        const failure = [];

        // create partner & org
        try {
          await createPartnerAndOrganisation(
            { partnerId: 'ae', partnerName: 'Actual Experience' },
            { organisationId: 'ae', organisationName: 'Actual Experience' },
            tokens
          );
          success.push({
            partnerId: 'ae',
            partnerName: 'Actual Experience',
            organisationId: 'ae/ae',
            organisationName: 'Actual Experience',
          });
        } catch (err) {
          console.error(err);
          failure.push('partner_org');
        }

        // create groups for context
        try {
          const partnerGroup = await createGroup(
            { groupName: 'ae', description: 'Actual Experience', precedence: 1 },
            tokens
          );
          success.push(partnerGroup);
        } catch (err) {
          console.error(err);
          failure.push('partner_group');
        }

        try {
          const orgGroup = await createGroup(
            { groupName: 'ae/ae', description: 'Actual Experience', precedence: 2 },
            tokens
          );
          success.push(orgGroup);
        } catch (err) {
          console.error(err);
          failure.push('org_group');
        }

        // create admin group
        try {
          const adminGroup = await createGroup(
            { groupName: TESSERACT_ADMIN_GROUP_NAME, description: 'Tesseract Admin Users', precedence: 10000 },
            tokens
          );
          success.push(adminGroup);
        } catch (err) {
          console.error(err);
          failure.push('admin_group');
        }

        // create user
        try {
          const globalEmail = 'no-reply@actual-experience.com';
          const user = await createUser(globalEmail, GLOBAL_CONTEXT, GLOBAL_CONTEXT, tokens, 'TestPass123!');
          success.push(user);

          try {
            // add user to admin group
            const addUserToGroup = await userGroupAction(
              //Username is the email !
              { userName: globalEmail, action: ApiMethods.ADD, groupName: TESSERACT_ADMIN_GROUP_NAME },
              tokens
            );
            success.push(addUserToGroup);
          } catch (err) {
            console.error(err);
            failure.push('add_user_to_admin_group');
          }
        } catch (err) {
          console.error(err);
          failure.push('create_user');
        }

        // add AE SSO context mapping
        try {
          const globalMapping = await setContextForIdp('ActualExperience', GLOBAL_CONTEXT, tokens);
          success.push(globalMapping);

          const contextMapping = await setContextForIdp('ActualExperience', 'ae', tokens);
          success.push(contextMapping);
        } catch (err) {
          console.error(err);
          failure.push('sso_mapping');
        }

        // handle response
        if (failure.length > 0) {
          throw failWithCode('Bootstrap failed', 500, undefined, { success, failure });
        }
        return { ok: true, data: { success, failure } };
      });
    } else {
      builder.default((req, res, { failWithCode }) => {
        throw failWithCode('Not enabled', 404);
      });
    }
  },
  { authenticate: false }
);
