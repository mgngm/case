import useReport from 'src/hooks/use-report';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import { selectMetrics } from 'src/slices/dashboard';
import { Metrics } from 'src/types/slices';
import styles from './graphics.module.scss';

const Metrics = ({ metrics }: { metrics?: Metrics }) => {
  const { report } = useReport();
  const data = metrics ?? selectMetrics(report?.reportData);

  return (
    (data && (
      <div className={styles.metrics}>
        <div className={styles.metricTable}>
          <div className={styles.tableSegment}>
            <div className={styles.segmentTitle}>Payroll Opportunity</div>
            <div className={styles.segmentInfo}>
              {data?.currency}
              {constructValueDisplayString(data?.payroll?.value, 1)}
            </div>
          </div>
          <div className={styles.tableSegment}>
            <div className={styles.segmentTitle}>Business Efficiency </div>
            <div className={styles.segmentInfo}>{constructValueDisplayString(data?.efficiency?.value, 1)} days</div>
          </div>
          <div className={styles.tableSegment}>
            <div className={styles.segmentTitle}>Revenue Opportunity</div>
            <div className={styles.segmentInfo}>
              {data?.currency}
              {constructValueDisplayString(data?.revenue?.value, 1)}
            </div>
          </div>
        </div>
      </div>
    )) ??
    null
  );
};

export default Metrics;
