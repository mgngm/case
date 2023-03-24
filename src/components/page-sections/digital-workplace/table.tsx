import type { SankeyData } from 'src/logic/libs/digital-workplace';
import { round } from 'src/logic/libs/helpers';
import styles from './digital-workplace.module.scss';

const Table = ({ data }: { data: SankeyData }) => {
  const { totalEmployees, locationBreakdown, hybridBreakdown } = data;

  const percentage = (value: number, total: number) => {
    if (value > 0 && total > 0) {
      const res = round((value / total) * 100, 1);
      return `${res}%`;
    }

    return '';
  };

  return (
    <div className={styles.table}>
      <div className={styles.table__row}>
        <div className={styles.table__row__title}>Employees</div>
        <div className={styles.table__row__value}>{totalEmployees.value}</div>
        <div className={styles.table__row__percentage} />
      </div>

      {locationBreakdown.map(({ id, title, value }) => (
        <div className={styles.table__row} key={id}>
          <div className={styles.table__row__title}>{title} working</div>
          <div className={styles.table__row__value}>{value}</div>
          <div className={styles.table__row__percentage}>{percentage(value, totalEmployees.value)}</div>
        </div>
      ))}
      <div className={styles.table__row}>
        <div className={styles.table__row__heading}>Days per week in the office</div>
        <div />
      </div>

      {hybridBreakdown.map(({ id, title, value }) => (
        <div className={styles.table__row} key={id}>
          <div className={styles.table__row__title}>{title}</div>
          <div className={styles.table__row__value}>{value}</div>
          <div className={styles.table__row__percentage}>{percentage(value, totalEmployees.value)}</div>
        </div>
      ))}
    </div>
  );
};

export default Table;
