import clsx from 'clsx';
import { DeltaArrowDirection, DeltaArrowColor, DELTA_STRING_MAP } from 'src/constants/report';
import {
  BAND_TYPE_FRUSTRATED,
  HOME_WORKERS,
  HYBRID_WORKERS,
  OFFICE_WORKERS,
  TOTAL_EMPLOYEES,
} from 'src/constants/scores';
import useIsPreview from 'src/hooks/use-is-preview';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import styles from './delta.module.scss';

const deltaArrowDirection = (metric = 0, refMetric = 0, invert = false) => {
  if (metric - refMetric !== 0) {
    if (invert) {
      return metric - refMetric < 0 ? DeltaArrowDirection.UP : DeltaArrowDirection.DOWN;
    } else {
      return metric - refMetric > 0 ? DeltaArrowDirection.UP : DeltaArrowDirection.DOWN;
    }
  } else {
    return DeltaArrowDirection.NONE;
  }
};

//Up is bad is the typical flow of the app, other things will invert colors.
const deltaArrowColor = (arrowDirection: DeltaArrowDirection, invert = false) => {
  if (invert) {
    return arrowDirection === DeltaArrowDirection.UP ? DeltaArrowColor.GREEN : DeltaArrowColor.RED;
  } else {
    return arrowDirection === DeltaArrowDirection.UP ? DeltaArrowColor.RED : DeltaArrowColor.GREEN;
  }
};

const deltaValue = (metric = 0, refMetric = 0) =>
  metric - refMetric < 0 ? (metric - refMetric) * -1 : metric - refMetric;

const GREYSCALE_DELTAS = [BAND_TYPE_FRUSTRATED, TOTAL_EMPLOYEES, HOME_WORKERS, OFFICE_WORKERS, HYBRID_WORKERS];

export const Delta = ({
  className,
  val,
  refVal,
  invert,
  id,
  prefix,
  suffix,
}: {
  className?: string | string[];
  val: number;
  refVal?: number;
  invert: boolean;
  id: string;
  prefix?: string;
  suffix?: string;
}) => {
  const preview = useIsPreview();
  if (preview || refVal === undefined || refVal === null) {
    return null;
  }

  const direction = deltaArrowDirection(val, refVal, id === 'equality');
  const color = deltaArrowColor(direction, invert);
  const delta =
    id !== 'equality' ? `${prefix ?? ''}${constructValueDisplayString(deltaValue(val, refVal), 1)}${suffix ?? ''}` : '';

  //Format the value to work in a text string
  const text =
    id !== 'equality'
      ? DELTA_STRING_MAP[id]?.[direction]
      : `${DELTA_STRING_MAP[id]?.[direction]} ${
          direction !== DeltaArrowDirection.NONE ? String.fromCharCode(refVal) : ''
        }`;

  const deltaDirectionClass = [DeltaArrowDirection.NONE, DeltaArrowDirection.NOT_AVAILABLE].includes(direction)
    ? null
    : direction === DeltaArrowDirection.UP
    ? styles.deltaUp
    : styles.deltaDown;
  const deltaColorClass = GREYSCALE_DELTAS.includes(id)
    ? styles.deltaGrey
    : color === DeltaArrowColor.GREEN
    ? styles.deltaGreen
    : styles.deltaRed;

  return (
    <div id={id} className={clsx([styles.deltaInfo, className])}>
      <div className={clsx(deltaColorClass, deltaDirectionClass)} />
      {direction !== DeltaArrowDirection.NONE ? (
        <div className={styles.deltaString}>{`${delta ?? ''}${text ? ` ${text}` : ''}`}</div>
      ) : (
        text && <div className={styles.deltaString}>{text}</div>
      )}
    </div>
  );
};
