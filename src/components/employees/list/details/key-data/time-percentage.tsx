import clsx from 'clsx';
import type { DU } from 'src/graphql';
import { round } from 'src/logic/libs/helpers';
import styles from './key-data.module.scss';

type FormattedTimePercentageProps = {
  employee: DU;
};

const TimePercentage = ({ employee }: FormattedTimePercentageProps) => {
  const officePercent = round(employee.hybridPercent ?? 0, 1);
  const remotePercent = 100 - officePercent;
  return (
    <div className={styles.timePercentageInner}>
      <div className={styles.subtitle}>Percentage of time spent working office vs remote</div>

      <div className={styles.timeVis}>
        <div style={{ width: `${officePercent}%` }} className={styles.timeVisOffice} />
        <div style={{ width: `${remotePercent}%` }} className={styles.timeVisRemote} />
      </div>

      <div className={styles.timeVisLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendVal}>{officePercent}%</div>
          <div className={clsx([styles.legendItemSpot, styles.office])} />
          <div className={styles.legendItemText}>Office</div>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendVal}>{remotePercent}%</div>
          <div className={clsx([styles.legendItemSpot, styles.remote])} />
          <div className={styles.legendItemText}>Remote</div>
        </div>
      </div>
    </div>
  );
};

export default TimePercentage;
