import { useCallback, useEffect, useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { useTheme } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MoonLoader } from 'react-spinners';
import AdminHeader from 'src/components/admin/header';
import ReportPreview from 'src/components/admin/preview';
import Navigation from 'src/components/navigation';
import { ADMIN_ROUTE } from 'src/constants/routes';
import { reportByContext } from 'src/graphql/queries';
import { useAppDispatch } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import { graphQL } from 'src/logic/client/graphql';
import { fetchPreviewReportData } from 'src/logic/client/report';
import { resetPreview } from 'src/slices/preview';
import homeStyles from 'styles/Home.module.scss';

enum PreviewState {
  LOADING = 'LOADING',
  READY = 'READY',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

const AdminPreview: NextPage = () => {
  const dispatch = useAppDispatch();
  const contextInfo = useContextInfo();
  const [previewState, setPreviewState] = useState(PreviewState.LOADING);
  const router = useRouter();
  const reportId = router.query.reportId as string;
  const newReport = !!router.query.newReport;
  const theme = useTheme();

  const initPreview = useCallback(
    async (reportId: string) => {
      if (reportId && contextInfo.adminContext.prettyId) {
        try {
          // send a query to check requested reportId is available on the selected admin context
          const contextCheckResp = await graphQL({
            query: reportByContext,
            variables: {
              context: contextInfo.adminContext.prettyId,
              filter: {
                id: { eq: reportId },
              },
            },
          });

          if (!contextCheckResp?.data?.reportByContext?.items.length) {
            // if reportId is not on the current admin context, bail out with an error message
            throw new Error('Invalid report ID context');
          }

          await dispatch(fetchPreviewReportData(reportId));
          setPreviewState(PreviewState.READY);
        } catch (e) {
          console.error(e);
          setPreviewState(PreviewState.NOT_AVAILABLE);
        }
      } else {
        setPreviewState(PreviewState.NOT_AVAILABLE);
      }
    },
    [dispatch, contextInfo.adminContext.prettyId]
  );

  useEffect(() => {
    initPreview(reportId);
  }, [reportId, dispatch, initPreview]);

  let content;

  switch (previewState) {
    case PreviewState.LOADING:
      content = (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MoonLoader color={theme.palette.primary.main} />
        </div>
      );
      break;
    case PreviewState.READY:
      content = <ReportPreview previewReportId={reportId} newReport={newReport} />;
      break;
    case PreviewState.NOT_AVAILABLE:
      content = (
        <div className={homeStyles.mainContentEmptyState} style={{ height: '60vh' }}>
          <WarningIcon className={homeStyles.warningIcon} />
          <div className={homeStyles.emptyStateTitle}>Report preview not available</div>
          <div className={homeStyles.emptyStateMessage}>
            We could not load this report preview. Please try a{' '}
            <span
              className={homeStyles.link}
              onClick={() => {
                dispatch(resetPreview());
                router.push(ADMIN_ROUTE);
              }}
            >
              different report.
            </span>
          </div>
        </div>
      );
      break;
  }

  return (
    <Navigation>
      <AdminHeader>{content}</AdminHeader>
    </Navigation>
  );
};
export default AdminPreview;
