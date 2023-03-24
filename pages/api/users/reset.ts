import { methodHandlers } from 'src/logic/server';
import { resetUser } from 'src/logic/server/auth';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.post<ResponseData<never>>(async (req, res, { tokens }) => {
    const email = req.body;
    await resetUser(email, tokens);
    return { ok: true };
  });
});
