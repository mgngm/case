import clsx from 'clsx';
import { Delta } from 'src/components/shared/delta';
import TooltipTarget from 'src/components/shared/tooltip-target';
import type { Datum } from 'src/types/data';
import styles from './metric-tile.module.scss';

interface MetricTitleProps extends Datum {
  tooltip: string;
  id: string;
  refVal?: number;
  deltaVal: number;
  invert?: boolean;
  prefix?: string;
  suffix?: string;
  selected?: boolean;
}

const MetricTile = ({
  id,
  title,
  value,
  deltaVal,
  refVal,
  invert = false,
  tooltip,
  prefix,
  suffix,
  selected,
}: MetricTitleProps) => {
  return (
    <div id={id} className={clsx(styles.keyMetric, selected && styles.selected, styles[id])}>
      <div className={styles.topRow}>
        <TooltipTarget tooltip={tooltip} />
        <div className={styles.metricTitle}>{title}</div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.metricValue}>{value}</div>
        <Delta val={deltaVal} refVal={refVal} invert={invert} id={id} prefix={prefix} suffix={suffix} />
      </div>
    </div>
  );
};

export default MetricTile;
