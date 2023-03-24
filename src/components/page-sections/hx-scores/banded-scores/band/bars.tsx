import { useMemo } from 'react';
import clsx from 'clsx';
import FormattedCountUp from 'src/components/ui/formatted-count-up';
import type { SingleScore } from 'src/types/scores';
import styles from './bars.module.scss';
import Bar from './single-bar';

interface BarProps extends SingleScore {
  employeesPage?: boolean;
}

const Bars = (props: BarProps) => {
  const scores = useMemo(
    () =>
      Object.entries(props.scores?.countValues ?? {}).map(([key, value]) => ({
        key,
        value,
      })),
    [props.scores?.countValues]
  );

  const counts = useMemo(
    () =>
      scores.map((singleScore) => (
        <FormattedCountUp className={styles.singleScoreCount} key={singleScore.key} value={singleScore.value} />
      )),
    [scores]
  );

  return (
    <div className={clsx(styles.barWrapper, props.employeesPage && styles.employeesPage)}>
      <div className={styles.singleBandBars}>
        {scores.map((singleScore) => {
          return (
            <div className={styles.singleScoreBar} key={singleScore.key}>
              <Bar score={singleScore.value} total={props.employeeTotal} bandType={props.bandType} />
            </div>
          );
        })}
      </div>
      <div className={styles.singleBandCounts}>{counts}</div>
      <div className={clsx(styles.singleBandValues, styles[`${props.bandType}Bg`])}>
        {scores.map((singleScore) => {
          return (
            <div className={clsx(styles.bandValue, styles[`${props.bandType}BandValue`])} key={singleScore.key}>
              {singleScore.key}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bars;
