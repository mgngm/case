import type { FunctionComponent, SVGProps } from 'react';
import useReport from 'src/hooks/use-report';
import GroupIcon from 'src/icons/general/group.svg';
import HomeIcon from 'src/icons/general/home.svg';
import OfficeIcon from 'src/icons/general/office.svg';
import RealEstateIcon from 'src/icons/general/real-estate.svg';
import { formatCount } from 'src/logic/libs/helpers';
import { selectEmployeeCounts } from 'src/slices/dashboard';
import type { EmployeeCounts } from 'src/types/slices';
import styles from './graphics.module.scss';

interface SingleScoreProps {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
  value: number | string;
}

const SingleScore = ({ title, value, Icon }: SingleScoreProps) => {
  return (
    <span className={styles.datum}>
      <Icon className={styles.icon} />
      <span className={styles.datumTitle}>{title}:</span>
      <span className={styles.datumValue}>{typeof value === 'number' ? formatCount(value) : value}</span>
    </span>
  );
};

const Breakdown = ({ employeeCounts }: { employeeCounts?: EmployeeCounts }) => {
  const { report } = useReport();
  const data = employeeCounts ?? selectEmployeeCounts(report?.reportData);

  return (
    (data && (
      <div className={styles.breakdown}>
        <div className={styles.breakdownInner}>
          <SingleScore title="Employees" value={data.total} Icon={GroupIcon} />
          <SingleScore title="Home" value={data.home} Icon={HomeIcon} />
          <SingleScore title="Office" value={data.office} Icon={OfficeIcon} />
          <SingleScore title="Hybrid" value={data.hybrid} Icon={RealEstateIcon} />
        </div>
      </div>
    )) ??
    null
  );
};

export default Breakdown;
