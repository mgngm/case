import clsx from 'clsx';
import { ByLocationOverTime } from 'src/components/employees/list/details/key-data/chart/by-location-over-time';
import { OverallOverTime } from 'src/components/employees/list/details/key-data/chart/overall-over-time';
import TimePercentage from 'src/components/employees/list/details/key-data/time-percentage';
import type { DU } from 'src/graphql';
import styles from './key-data.module.scss';
import WorkingLocation from './working-location';

type KeyDataProps = {
  employee: DU;
};

const KeyData = ({ employee }: KeyDataProps) => {
  return (
    <div className={styles.keyDataWrapper}>
      <div className={clsx([styles.workingLocation])}>
        <WorkingLocation employee={employee} />
      </div>
      <div className={clsx([styles.locationtime])}>
        <TimePercentage employee={employee} />
      </div>
      <div className={clsx([styles.chart])}>
        <ByLocationOverTime employee={employee} />
      </div>
      <div className={clsx([styles.chart])}>
        <OverallOverTime employee={employee} />
      </div>
    </div>
  );
};

export default KeyData;
