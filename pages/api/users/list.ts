import { methodHandlers } from 'src/logic/server';
import { listUsersInContext } from 'src/logic/server/users';
import type { ResponseData } from 'src/types/api';
import type { LocalUser } from 'src/types/user';

export default methodHandlers((builder) => {
  builder.post<ResponseData<{ users: LocalUser[] }>>(async (req, res, { tokens }) => {
    const { context } = req.body;

    const users = await listUsersInContext(context, tokens);

    if (!users) {
      throw new Error('There was an error listing users.');
    }
    return { ok: true, data: { users } };
  });
});
