import { methodHandlers } from 'src/logic/server';
import { createUser } from 'src/logic/server/auth';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.post<ResponseData<never>>(async (req, res, { tokens, succeedWithCode }) => {
    const { email, context, defaultContext } = req.body;

    await createUser(email, context, defaultContext, tokens);
    return succeedWithCode({ ok: true }, 201);
  });
});
