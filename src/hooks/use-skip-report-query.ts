import { useDebugValue } from 'react';
import { ReportState } from 'src/constants/report';

const useSkipReportQuery = (reportId: string | ReportState | null, isPreview: boolean) => {
  const skip =
    !reportId || (!isPreview && (reportId === ReportState.NOT_SET || reportId === ReportState.NO_REPORT_AVAILABLE));
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(skip);
  }
  return skip;
};

export default useSkipReportQuery;
