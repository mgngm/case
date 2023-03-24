import { useDebugValue } from 'react';
import { ReportState } from 'src/constants/report';
import type { Report } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import useIsPreview from 'src/hooks/use-is-preview';
import {
  selectCustomProjects,
  selectInsights,
  selectPreviewProjects,
  selectPreviewReportData,
  selectPreviewReportDate,
  selectPreviewReportName,
} from 'src/slices/preview';
import { selectCurrentReportId, selectRefReportId, useFetchReportQuery } from 'src/slices/report';
import type { DashboardData } from 'src/types/slices';

//for hook
export type HookReport = {
  loading: boolean;
  fetching: boolean;
  error: boolean;
  data: Report | null;
  reportData?: DashboardData | null; // do we want to bring the whole DAshboardData object back, if we're going to be extracting keys?
};

export type ReportHookData = {
  ready: boolean;
  ids: {
    selectedReportId: string | null;
    queryReportId: string | null;
    refReportId: string | null;
  };
  report: HookReport | null;
  refReport: HookReport | null;
  queryReport: HookReport | null;
};

const useReport = (queryReportId: string | null = null) => {
  const currentReportId = useAppSelector(selectCurrentReportId);
  const selectedReportId = queryReportId ?? currentReportId;
  const refReportId = useAppSelector(selectRefReportId);
  const previewReport = {} as Report;

  const preview = useIsPreview();

  const { report, reportLoading, reportUninitialized, reportFetching, reportError } = useFetchReportQuery(
    { id: selectedReportId as string },
    {
      skip:
        preview ||
        !selectedReportId ||
        selectedReportId === ReportState.NOT_SET ||
        selectedReportId === ReportState.NO_REPORT_AVAILABLE,
      selectFromResult: ({ isFetching, isLoading, data, isUninitialized, isError }) => ({
        reportLoading: isLoading,
        reportFetching: isFetching,
        report: data?.data,
        reportUninitialized: isUninitialized,
        reportError: isError,
      }),
    }
  );

  //Optional query to select a specific report (or ... reports? TODO).
  const { queryReport, queryReportLoading, queryReportFetching, queryReportError } = useFetchReportQuery(
    { id: queryReportId as string },
    {
      skip:
        !queryReportId || queryReportId === ReportState.NOT_SET || queryReportId === ReportState.NO_REPORT_AVAILABLE,
      selectFromResult: ({ isFetching, isLoading, data, isError }) => ({
        queryReportLoading: isLoading,
        queryReportFetching: isFetching,
        queryReport: data?.data,
        queryReportError: isError,
      }),
    }
  );

  const { refReport, refReportLoading, refReportUninitialized, refReportFetching, refReportError } =
    useFetchReportQuery(
      { id: refReportId as string },
      {
        skip:
          preview ||
          !refReportId ||
          refReportId === ReportState.NOT_SET ||
          refReportId === ReportState.NO_REPORT_AVAILABLE,
        selectFromResult: ({ isFetching, isLoading, data, isUninitialized, isError }) => ({
          refReportLoading: isLoading,
          refReportFetching: isFetching,
          refReport: data?.data,
          refReportUninitialized: isUninitialized,
          refReportError: isError,
        }),
      }
    );

  const customProjects = useAppSelector(selectCustomProjects);
  const insightIds = useAppSelector(selectInsights);
  const previewReportData = useAppSelector(selectPreviewReportData);
  const previewProjects = useAppSelector(selectPreviewProjects);
  const previewReportName = useAppSelector(selectPreviewReportName);
  const previewReportDate = useAppSelector(selectPreviewReportDate);

  if (preview) {
    previewReport.customProjects = JSON.stringify(customProjects);
    previewReport.insightIds = insightIds;
    previewReport.reportData = JSON.stringify(previewReportData);
    previewReport.projectIds = previewProjects?.map(({ id }) => id) ?? [];
    previewReport.reportName = previewReportName;
    previewReport.reportDate = previewReportDate;
  }

  const reportReady = !reportUninitialized && !reportLoading && !reportFetching;
  const refReportReady = !refReportUninitialized && !refReportLoading && !refReportFetching;

  const reportMap: ReportHookData = {
    ready: preview || (reportReady && refReportReady),
    ids: {
      refReportId,
      selectedReportId,
      queryReportId, // id for matched query if you want something specific.
    },
    report: preview
      ? {
          loading: false,
          data: previewReport,
          fetching: false,
          error: false,
          reportData: previewReportData,
        }
      : report
      ? {
          loading: reportLoading,
          fetching: reportFetching,
          data: report,
          error: reportError,
          reportData: report?.reportData ? JSON.parse(report.reportData) : null,
        }
      : null,
    queryReport: queryReport
      ? {
          loading: queryReportLoading,
          fetching: queryReportFetching,
          data: queryReport,
          error: queryReportError,
          reportData: queryReport.reportData ? JSON.parse(queryReport.reportData) : null,
        }
      : null,
    refReport:
      !preview && refReport
        ? {
            loading: refReportLoading,
            fetching: refReportFetching,
            data: refReport,
            error: refReportError,
            reportData: refReport?.reportData ? JSON.parse(refReport.reportData) : null,
          }
        : null,
  };

  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(reportMap);
  }

  return reportMap;
};

export default useReport;
