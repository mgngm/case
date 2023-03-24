import Image from 'next/image';
import type { ProjectMetric } from 'src/types/projects';
import styles from './projects.module.scss';

const Metric = ({ metric }: { metric: ProjectMetric }) => {
  return (
    <div className={styles.tile}>
      <div className={styles.tile__icon}>
        <Image src={metric.icon ?? '/assets/projects/key-takeaways.svg'} alt="Key metric icon" layout="fill" />
      </div>
      <div className={styles.tile__info}>
        <div className={styles.tile__label}>Key Takeaway</div>
        <div className={styles.tile__value}>{metric.text}</div>
      </div>
    </div>
  );
};

export default Metric;
