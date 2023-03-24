import { methodHandlers } from 'src/logic/server';
import { deleteGroups, listAllGroups } from 'src/logic/server/groups';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.delete<ResponseData>(async (req, res, { tokens, failWithCode }) => {
    const { id, partnerLevel } = req.body;
    if (!id) {
      throw failWithCode('No ID provided', 400);
    }

    //Delete group now

    if (partnerLevel) {
      //As we're a partner group we want to find all of the groups under this partner
      const allGroups = await listAllGroups(tokens);

      if (!allGroups) {
        throw new Error(`Could not list partner groups for ${id}`);
      }

      //Filter the groups we care about and extract just the groupName
      const groupsToDelete = allGroups.reduce<string[]>(
        (groupNames, { GroupName }) => {
          if (GroupName?.includes(`${id}/`)) {
            groupNames.push(GroupName);
          }
          return groupNames;
        },
        [id]
      );

      await deleteGroups(groupsToDelete, tokens);
    } else {
      await deleteGroups([id], tokens);
    }

    return { ok: true };
  });
});
