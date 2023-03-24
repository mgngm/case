import { methodHandlers } from 'src/logic/server';
import { getUser, updateUserDefaultContext } from 'src/logic/server/users';

export default methodHandlers((builder) => {
  builder.post(async (req, res, { tokens, failWithCode }) => {
    const { userSub, defaultContext } = JSON.parse(req.body);

    if (!userSub || !defaultContext) {
      throw failWithCode('Invalid request, missing user sub or new default context', 400);
    }

    const user = await getUser(userSub, tokens);
    //For every user, user sub is the username, except for SSO. FFS. Get their details and send it in.
    await updateUserDefaultContext(user?.Username ?? userSub, defaultContext, tokens);
    return { ok: true };
  });
});
