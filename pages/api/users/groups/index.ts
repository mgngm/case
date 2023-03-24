import { methodHandlers } from 'src/logic/server';
import { createGroup, deleteGroups } from 'src/logic/server/groups';
import type { ResponseData } from 'src/types/api';
import type { Group } from 'src/types/groups';

export default methodHandlers((builder) => {
  builder
    .post<ResponseData<Group>>(async (req, res, { tokens, failWithCode, succeedWithCode }) => {
      const { groupName, description, precedence } = req.body;

      if (!groupName || !description || !precedence) {
        throw failWithCode('Invalid group', 400);
      }

      const group = await createGroup({ groupName, description, precedence }, tokens);
      return succeedWithCode({ ok: true, data: group }, 201);
    })
    .delete<ResponseData<{ success: string[]; fail: string[] }> | void>(
      async (req, res, { tokens, failWithCode, succeedWithCode }) => {
        const { groups } = req.body;

        if (!groups || groups.length === 0) {
          return;
        }

        const { success, fail } = await deleteGroups(groups, tokens);

        if (success.length === 0) {
          throw failWithCode('Group delete failed', 500, undefined, { success, fail });
        }

        return succeedWithCode({ ok: true, data: { success, fail } }, 201);
      }
    );
});
