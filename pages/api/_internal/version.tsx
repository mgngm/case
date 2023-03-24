import { version } from 'package.json';
import { methodHandlers } from 'src/logic/server';

export default methodHandlers((builder) => {
  builder.get<{ version: string }>(async () => {
    return { version };
  });
});
