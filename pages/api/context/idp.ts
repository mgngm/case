import { methodHandlers } from 'src/logic/server';
import { getContextForIdp } from 'src/logic/server/context';
import type { ContextMap } from 'src/models';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.post<ResponseData<{ context: ContextMap }>>(async (req, res, { tokens, failWithCode }) => {
    const { idp } = req.body;
    if (!idp) {
      throw failWithCode('No idp provided', 400);
    }
    const context = await getContextForIdp(idp, tokens);

    if (context) {
      return { ok: true, data: { context } };
    } else {
      throw new Error('Could not find a context for the idp');
    }
  });
});
