import { ApiMethods } from 'src/constants/api';
import type { MethodHandler } from 'src/logic/server';
import { methodHandlers } from 'src/logic/server';
import { userGroupAction } from 'src/logic/server/auth';
import type { ResponseData } from 'src/types/api';
import type { Tokens } from 'src/types/auth';

/* possibly worth making a mechanism to add a handler for multiple methods?
 * `builder.methods(["POST", "DELETE"], postDeleteHandler)`
 * or even `builder.matcher((method) => ["POST", "DELETE"].includes(method), postDeleteHandler)
 */
const postDeleteHandler: MethodHandler<ResponseData, Tokens> = async (req, res, { tokens, failWithCode }) => {
  const { groupName, userName } = req.body;

  if (!userName || !groupName) {
    throw failWithCode('Invalid request, missing email or group name', 400);
  }
  await userGroupAction(
    { userName, groupName, action: req.method === 'POST' ? ApiMethods.ADD : ApiMethods.DELETE },
    tokens
  );
  return { ok: true };
};

export default methodHandlers((builder) => {
  builder.post(postDeleteHandler).delete(postDeleteHandler);
});
