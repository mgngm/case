import { TESSERACT_ADMIN_GROUP_NAME } from 'src/constants/admin';
import { methodHandlers } from 'src/logic/server';
import { getGroupsForUser, listUsersInContext, deleteCognitoUser } from 'src/logic/server/users';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.delete<ResponseData<{ failures: string[] }>>(async (req, res, { tokens, failWithCode }) => {
    const { orgId } = req.body;
    if (!orgId) {
      throw failWithCode('No orgId provided', 404); // 400?
    }

    //Get all users in group
    const users = await listUsersInContext(orgId, tokens);

    const failures: string[] = [];

    for (const _user of users) {
      try {
        //Get all groups for this user to see if they're suitable for deletion.
        const _groups = await getGroupsForUser(_user.userSub, tokens);
        let deleteUser = false;

        //If the user is in more than 2 groups, they must have more than one context (incl admin) so don't touch them.
        if (_groups.length > 2) {
          continue;
        } else if (_groups.length === 2) {
          //if the user is in only two groups and the other is admin, delete this user.
          if (_groups.some((_group) => _group.GroupName === TESSERACT_ADMIN_GROUP_NAME)) {
            deleteUser = true;
          } else {
            //Otherwise, it has another legitimate context, so we'll ignore it.
            continue;
          }
        } else {
          //Otherwise, green light go
          deleteUser = true;
        }

        if (deleteUser) {
          //Delete user here
          await deleteCognitoUser(_user.userSub, tokens);
        }
      } catch (e) {
        console.error('Could not successfully delete user', _user.email);
        //Do we want to log failed users out? or just keep this in case we need to debug?
        failures.push(_user.email);
      }
    }

    if (failures.length) {
      throw failWithCode(`Failed to delete all users for ${orgId}`, 500, undefined, { failures });
    }

    return { ok: true };
  });
});
