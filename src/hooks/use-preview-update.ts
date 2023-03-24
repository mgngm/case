import { useCallback, useEffect } from 'react';
import { REPORT_PREVIEW_MESSAGE } from 'src/constants/report';
import { REPORT_PROJECTS_TAG, REPORT_TAG } from 'src/constants/slices';
import { useAppDispatch } from 'src/hooks';
import useIsPreview from 'src/hooks/use-is-preview';
import {
  setCustomProjects,
  setInsights,
  setPreviewProjects,
  setPreviewReportData,
  setPreviewReportDate,
  setPreviewReportName,
} from 'src/slices/preview';
import { dashboardsGraphql } from 'src/slices/report';

const usePreviewUpdate = () => {
  const preview = useIsPreview();
  const dispatch = useAppDispatch();
  const messageHandler = useCallback(
    (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) {
        return;
      }

      //This is / will be all the data we need for preview area in the app - if we need new data we need to add it to the preview slice and make surei t's being picked up here.
      if (ev.data?.type === REPORT_PREVIEW_MESSAGE) {
        if (ev.data.payload.reportData) {
          const reportData = JSON.parse(ev.data.payload.reportData ?? '{}');
          dispatch(setPreviewReportData(reportData));

          const customProjects = JSON.parse(ev.data.payload.customProjects ?? '[]');
          dispatch(setCustomProjects(customProjects));

          const previewProjects = JSON.parse(ev.data.payload.projects ?? '[]');
          dispatch(setPreviewProjects(previewProjects));

          const insights = JSON.parse(ev.data.payload.insights ?? '[]');
          dispatch(setInsights(insights));

          dispatch(setPreviewReportName(`${ev.data.payload.reportName}` ?? 'Unknown'));
          dispatch(setPreviewReportDate(`${ev.data.payload.reportDate ?? new Date().toISOString().split('T')[0]}`));

          //Finally, you need to invalidate tags for the api to refresh the queries (which will grab this data from preview state)
          dispatch(dashboardsGraphql.util.invalidateTags([REPORT_TAG, REPORT_PROJECTS_TAG]));
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (preview) {
      window.addEventListener('message', messageHandler, false);
      return () => {
        window.removeEventListener('message', messageHandler);
      };
    }
  }, [preview, messageHandler]);
};

export default usePreviewUpdate;
