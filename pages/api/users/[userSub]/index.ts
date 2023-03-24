import { methodHandlers } from 'src/logic/server';
import { getUser } from 'src/logic/server/users';
import type { ResponseData } from 'src/types/api';
import type { LocalUser } from 'src/types/user';

export default methodHandlers((builder) => {
  builder.get<ResponseData<{ user: LocalUser }>>(async (req, res, { tokens }) => {
    const { userSub } = req.query;

    const user = await getUser(userSub as string, tokens);

    if (!user) {
      throw new Error(`There was an error getting user ${userSub}.`);
    }

    return { ok: true, data: { user } };
  });
});
