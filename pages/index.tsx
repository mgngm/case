import { useEffect } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { useTheme } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { MoonLoader } from 'react-spinners';
import Navigation from 'src/components/navigation';
import HXScores from 'src/components/page-sections/hx-scores';
import HXTitle from 'src/components/page-sections/hx-title';
import KeyMetrics from 'src/components/page-sections/key-metrics';
import { ReportState } from 'src/constants/report';
import { useAppDispatch } from 'src/hooks/index';
import useContextInfo from 'src/hooks/use-context-info';
import useIsPreview from 'src/hooks/use-is-preview';
import usePreviewUpdate from 'src/hooks/use-preview-update';
import useReport from 'src/hooks/use-report';
import { reportSelectorOpenStateChanged } from 'src/slices/dashboard';
import { initialiseReport } from 'src/slices/report';
import styles from 'styles/Home.module.scss';

const Landing: NextPage = () => {
  const preview = useIsPreview();
  usePreviewUpdate(); //This sets up all listeners for the preview state. Don't mess with it.

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const openReportSelector = () => {
    dispatch(reportSelectorOpenStateChanged(true));
  };

  const _r = useReport();
  const contextInfo = useContextInfo();

  //On initial load, if the selected report id is blank (we haven't set one yet) then go figure it out.
  useEffect(() => {
    if (!preview && _r?.ids.selectedReportId === ReportState.NOT_SET && contextInfo.reportContext.prettyId) {
      dispatch(initialiseReport(contextInfo.reportContext.prettyId));
    }
    //eslint-disable-next-line
  }, []);

  //We only care about the main report loading we don't want to hold the app up for anything else.
  const loading = _r.report?.loading || _r?.ids.selectedReportId === ReportState.NOT_SET;
  const empty = !preview && (_r?.report?.error || _r?.ids.selectedReportId === ReportState.NO_REPORT_AVAILABLE);

  const header = (
    <>
      <Head>
        <title>Actual Experience Portal | Business Insights</title>
      </Head>
    </>
  );

  if (loading) {
    return (
      <>
        {header}
        <div className={styles.loadingWrapper}>
          <MoonLoader color={theme.palette.primary.main} />
        </div>
      </>
    );
  }

  if (empty) {
    return (
      <>
        {header}
        <Navigation>
          <div className={styles.mainContentEmptyState}>
            <WarningIcon className={styles.warningIcon} />
            <div className={styles.emptyStateTitle}>No Data Available</div>
            <div className={styles.emptyStateMessage}>
              You do not have a report selected. Please choose{' '}
              <span className={styles.link} onClick={() => openReportSelector()}>
                a report.
              </span>
            </div>
          </div>
        </Navigation>
      </>
    );
  }

  return (
    <>
      {header}
      <Navigation>
        <div className={styles.mainContentWrapper}>
          <div className={styles.pageSections}>
            <HXTitle />
            <HXScores />
            <KeyMetrics />
          </div>
        </div>
      </Navigation>
    </>
  );
};

export default Landing;
