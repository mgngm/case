import { methodHandlers } from 'src/logic/server';
import { migrateReportListToDynamo } from 'src/logic/server/s3/migration';
import type { ResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.post<ResponseData>(async (req, res, { tokens, failWithCode }) => {
    try {
      const s3Files = JSON.parse(req.body) as string[];
      await migrateReportListToDynamo(s3Files, tokens);
    } catch (e) {
      failWithCode(`There was an error migrating S3 files into dynamo. ${e}`, 500);
    }

    return { ok: true };
  });
});
