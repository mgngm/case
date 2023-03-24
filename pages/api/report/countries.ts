import { z } from 'zod';
import { methodHandlers } from 'src/logic/server';
import { getCountriesForReport } from 'src/logic/server/report';

export default methodHandlers((builder) => {
  builder.get<string[]>(async (req, res, { tokens }) => {
    const { reportId } = z.object({ reportId: z.string() }).parse(req.query);
    return getCountriesForReport(reportId, tokens);
  });
});
