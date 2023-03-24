import { methodHandlers } from 'src/logic/server';
import { getGroupsForUser } from 'src/logic/server/users';
import type { ResponseData } from 'src/types/api';
import type { AWSGroup } from 'src/types/groups';

export default methodHandlers((builder) => {
  builder.post<ResponseData<{ groups: AWSGroup[] }>>(async (req, res, { tokens, failWithCode }) => {
    const { username } = req.body;
    if (!username) {
      throw failWithCode('No username provided', 404);
    }

    const groups = await getGroupsForUser(username, tokens);

    if (groups.length === 0) {
      throw new Error('Group get failed');
    }

    return { ok: true, data: { groups } };
  });
});
