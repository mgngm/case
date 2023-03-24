import type { ReactNode } from 'react';
import clsx from 'clsx';
import BreakdownRadial from 'src/components/page-sections/working-location-scores/breakdown-radial';
import OverviewRadial from 'src/components/page-sections/working-location-scores/overview-radial';
import {
  BAND_CONSTANTS,
  BAND_TYPE_FRUSTRATED,
  BAND_TYPE_SATISFIED,
  BAND_TYPE_SUFFERING,
  OVERVIEW_DATA_VIEW_STRING,
  WORKING_LOCATION_ALL,
  WORKING_LOCATION_HOME,
  WORKING_LOCATION_OFFICE,
} from 'src/constants/scores';
import HomeSvg from 'src/icons/general/home.svg';
import OfficeSvg from 'src/icons/general/office.svg';
import AllSvg from 'src/icons/general/real-estate.svg';
import type { WorkingLocation, WorkingLocations } from 'src/types/csv';
import styles from './working-location-scores.module.scss';

export interface WorkingLocationSingle extends WorkingLocation {
  locationType: string;
  dataView: string;
  title?: string;
  chartOverrides?: {
    width?: number;
    height?: number;
    colorOverrides?: {
      hollow?: string;
      track?: string;
      text?: string;
    };
  };
}

const icon: Record<string, ReactNode> = {
  [WORKING_LOCATION_HOME]: <HomeSvg className={styles.workingLocationIcon} />,
  [WORKING_LOCATION_OFFICE]: <OfficeSvg className={styles.workingLocationIcon} />,
  [WORKING_LOCATION_ALL]: <AllSvg className={styles.workingLocationIcon} />,
};

const WorkingLocationSingle = ({
  locationType,
  dataView,
  title,
  score,
  percentages,
  chartOverrides,
}: WorkingLocationSingle) => {
  let overviewSummaryColor = styles.overviewSummaryColorBad;
  let overviewSummaryText = BAND_TYPE_SUFFERING;
  if (score >= 8) {
    overviewSummaryText = BAND_TYPE_SATISFIED;
    overviewSummaryColor = styles.overviewSummaryColorGood;
  } else if (score >= 5) {
    overviewSummaryColor = styles.overviewSummaryColorOK;
    overviewSummaryText = BAND_TYPE_FRUSTRATED;
  }

  return (
    <div className={styles.workingLocationSingle}>
      {icon[locationType]}
      <div className={styles.workingLocationTitle}>{title ?? locationType}</div>
      {dataView === OVERVIEW_DATA_VIEW_STRING ? (
        <>
          <OverviewRadial score={score} {...chartOverrides} />
          <div className={styles.workingLocationSummary}>
            <div className={overviewSummaryColor} />
            {BAND_CONSTANTS[overviewSummaryText].title}
          </div>
        </>
      ) : (
        <>
          <BreakdownRadial percentages={percentages} score={score} />
          <div className={styles.workingLocationSummary}>
            <div className={styles.overviewSummaryColorGood} />
            <div>
              {BAND_CONSTANTS[BAND_TYPE_SATISFIED].title}
              <span className={styles.breakdownPercentage}>({Math.round(percentages.satisfied)}%)</span>
            </div>
            <div>
              <div className={styles.overviewSummaryColorOK} />
              {BAND_CONSTANTS[BAND_TYPE_FRUSTRATED].title}
              <span className={styles.breakdownPercentage}>({Math.round(percentages.frustrated)}%)</span>
            </div>
            <div>
              <div className={styles.overviewSummaryColorBad} />
              {BAND_CONSTANTS[BAND_TYPE_SUFFERING].title}
              <span className={styles.breakdownPercentage}>({Math.round(percentages.suffering)}%)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const emptyLocation: WorkingLocation = {
  score: 0,
  percentages: {
    suffering: 0,
    satisfied: 0,
    frustrated: 0,
  },
};

export type RadialLocations = WorkingLocations & { all?: WorkingLocation };

const Radials = ({
  dataView,
  data,
  titles,
  chartOverrides,
  className,
}: {
  dataView: string;
  data: RadialLocations;
  titles?: Record<keyof RadialLocations, string>;
  className?: string;
  chartOverrides?: {
    width?: number;
    height?: number;
    colorOverrides?: {
      hollow?: string;
      track?: string;
      text?: string;
    };
  };
}) => (
  <div className={clsx([styles.workingLocationsContent, className])}>
    {data.all && (
      <WorkingLocationSingle
        locationType={WORKING_LOCATION_ALL}
        {...data[WORKING_LOCATION_ALL]}
        dataView={dataView}
        title={titles?.[WORKING_LOCATION_ALL]}
        chartOverrides={chartOverrides}
      />
    )}
    <WorkingLocationSingle
      locationType={WORKING_LOCATION_OFFICE}
      {...(data?.office ?? emptyLocation)}
      dataView={dataView}
      title={titles?.[WORKING_LOCATION_OFFICE]}
      chartOverrides={chartOverrides}
    />
    <WorkingLocationSingle
      locationType={WORKING_LOCATION_HOME}
      {...(data?.home ?? emptyLocation)}
      dataView={dataView}
      title={titles?.[WORKING_LOCATION_HOME]}
      chartOverrides={chartOverrides}
    />
  </div>
);

export default Radials;
