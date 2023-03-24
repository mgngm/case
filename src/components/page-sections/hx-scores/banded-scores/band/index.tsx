import clsx from 'clsx';
import { Delta } from 'src/components/shared/delta';
import TooltipTarget from 'src/components/shared/tooltip-target';
import { BAND_CONSTANTS } from 'src/constants/scores';
import { formatPercentageDisplayString } from 'src/logic/libs/helpers';
import type { SingleScore } from 'src/types/scores';
import styles from './band.module.scss';
import Bars from './bars';

interface BandProps extends SingleScore {
  employeesPage?: boolean;
  refScores?: {
    employeeCount: number;
    countValues: {
      [key: string]: number;
    };
  };
  refTotal?: number;
  invert?: boolean;
}

const Band = (props: BandProps) => {
  const bandOptions = BAND_CONSTANTS[props.bandType];

  const bandPercent = parseFloat(((props.scores.employeeCount / props.employeeTotal) * 100).toFixed(1));
  const refPercent =
    props.refScores && props.refTotal
      ? parseFloat(((props.refScores.employeeCount / props.refTotal) * 100).toFixed(1))
      : undefined;

  //We want the band to be a bit wider if it's the suffering band as that has 4 in it.
  return (
    <div className={clsx([styles.bandWrapper, props.employeesPage && styles.employeesPage])}>
      <Bars
        scores={props.scores}
        employeeTotal={props.employeeTotal}
        bandType={props.bandType}
        employeesPage={props.employeesPage}
      />
      <div className={clsx(styles.bandTitle, styles[`${bandOptions.cssIdentifier}Title`])}>
        <span>
          {bandOptions.title}
          <TooltipTarget tooltip={bandOptions.tooltip} />
        </span>
      </div>
      <div className={styles.bandInfo}>
        <div className={styles.percentage}>
          {formatPercentageDisplayString(props.scores?.employeeCount, props.employeeTotal)}
        </div>
        <div>({props.scores?.employeeCount})</div>
      </div>
      <div className={styles.bandDelta}>
        <Delta val={bandPercent} refVal={refPercent} invert={props.invert ?? false} id={props.bandType} suffix="%" />
      </div>
    </div>
  );
};

export default Band;
