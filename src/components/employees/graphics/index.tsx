import { Alert, useTheme } from '@mui/material';
import clsx from 'clsx';
import { MoonLoader } from 'react-spinners';
import BandedScores from 'src/components/page-sections/hx-scores/banded-scores';
import Radials, { emptyLocation } from 'src/components/page-sections/working-location-scores/radials';
import { OVERVIEW_DATA_VIEW_STRING } from 'src/constants/scores';
import useContextInfo from 'src/hooks/use-context-info';
import useReport from 'src/hooks/use-report';
import { formatCount } from 'src/logic/libs/helpers';
import {
  selectBandedScores,
  selectEmployeeCounts,
  selectHXScore,
  selectMetrics,
  selectWorkingLocationDataByPersona,
} from 'src/slices/dashboard';
import { useGetFilteredReportQuery } from 'src/slices/report';
import Breakdown from './breakdown';
import styles from './graphics.module.scss';
import Metrics from './metrics';

export const MAX_DU_FILTER = 2000;

const EmployeesGraphics = ({
  dus,
  filterCount,
  dataLoading,
}: {
  dus: string[];
  filterCount: number;
  dataLoading: boolean;
}) => {
  const { ids, report } = useReport();
  const { reportContext } = useContextInfo();
  const reportData = report?.reportData;

  const theme = useTheme();

  const { data, isLoading, isFetching, isError } = useGetFilteredReportQuery(
    { reportId: ids.selectedReportId, orgId: reportContext.prettyId, dus: dus },
    {
      // skip if we don't have a filter, too many DUs or we're fetching the DUs themselves
      skip: filterCount === 0 || (dus && dus.length > MAX_DU_FILTER) || dataLoading,
      selectFromResult: ({ data, isLoading, isFetching, isError }) => ({
        data: data || reportData,
        isLoading,
        isFetching,
        isError,
      }),
    }
  );

  let overlay = null;

  if (isLoading || isFetching) {
    // show loading if we're fetching the filter result
    overlay = (
      <div className={styles.graphicsOverlay}>
        <div className={styles.loadingWrapper} id="du-graphics-overlay-loading">
          <MoonLoader color={theme.palette.primary.main} />
        </div>
      </div>
    );
  } else if (dus.length > MAX_DU_FILTER && filterCount > 0) {
    // if we've skipped the fetch because there are too many DUs,
    // show the message rather than wait for everything to come back
    overlay = (
      <div className={styles.graphicsOverlay}>
        <Alert id="du-graphics-overlay-error" severity="info" variant="outlined">
          There are too many DUs to use preview mode. Filter DUs down to {formatCount(MAX_DU_FILTER)} or fewer to see
          the preview.
        </Alert>
      </div>
    );
  } else if (dataLoading) {
    // if there is a valid filter request, wait for the data before rendering the filter result
    overlay = (
      <div className={styles.graphicsOverlay}>
        <div className={styles.loadingWrapper} id="du-graphics-overlay-loading">
          <MoonLoader color={theme.palette.primary.main} />
        </div>
      </div>
    );
  } else if (isError || (data === null && filterCount > 0)) {
    // show an error if we have one and we've got the data
    overlay = (
      <div className={styles.graphicsOverlay}>
        <Alert id="du-graphics-overlay-error" severity="error" variant="outlined">
          Error: could not get scores for current filter
        </Alert>
      </div>
    );
  }

  // fallback to report data if we don't have a filter
  const filterData = filterCount ? data : reportData;
  const locationScores = selectWorkingLocationDataByPersona(filterData);

  return (
    <div className={styles.graphicsOuterWrapper}>
      {overlay}
      <div className={clsx([styles.graphicsWrapper, overlay && styles.graphicsOverlayBlur])}>
        <div className={styles.graphicsTopWrapper}>
          <div className={styles.radials} id="du-graphics-radials">
            <Radials
              dataView={OVERVIEW_DATA_VIEW_STRING}
              data={{
                office: locationScores?.office ?? emptyLocation,
                home: locationScores?.home ?? emptyLocation,
                all: { ...emptyLocation, score: selectHXScore(filterData)?.value ?? 0 },
              }}
              titles={{ all: 'Overall HX', office: 'Office HX', home: 'Remote HX' }}
              chartOverrides={{
                width: 225,
                height: 250,
                colorOverrides: {
                  hollow: 'transparent',
                },
              }}
              className={styles.radialsInnerWrapper}
            />
          </div>
          <div className={styles.distribution} id="du-graphics-score-distribution">
            <BandedScores employeesPage scores={selectBandedScores(filterData)} />
          </div>
        </div>
        <div className={styles.metricsWrapper} id="du-graphics-metrics">
          <Metrics metrics={selectMetrics(filterData)} />
        </div>
        <div className={styles.counts} id="du-graphics-counts">
          <Breakdown employeeCounts={selectEmployeeCounts(filterData)} />
        </div>
      </div>
    </div>
  );
};

export default EmployeesGraphics;
