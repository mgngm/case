import type { FunctionComponent, SVGProps } from 'react';
import { Delta } from 'src/components/shared/delta';
import { HOME_WORKERS, HYBRID_WORKERS, OFFICE_WORKERS, TOTAL_EMPLOYEES } from 'src/constants/scores';
import useReport from 'src/hooks/use-report';
import GroupIcon from 'src/icons/general/group.svg';
import HomeIcon from 'src/icons/general/home.svg';
import OfficeIcon from 'src/icons/general/office.svg';
import RealEstateIcon from 'src/icons/general/real-estate.svg';
import { formatCount } from 'src/logic/libs/helpers';
import { selectEmployeeCounts } from 'src/slices/dashboard';
import type { Datum } from 'src/types/data';
import styles from './styles.module.scss';

interface SingleScoreProps extends Datum {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  value: number;
  refVal?: number;
  id: string;
}

const SingleScore = ({ title, value, Icon, refVal, id }: SingleScoreProps) => {
  return (
    <span className={styles.employeeDatum}>
      <Icon className={styles.icon} />
      <span className={styles.datumTitle}>{title}:</span>
      <span className={styles.datumValue}>{typeof value === 'number' ? formatCount(value) : value}</span>
      <span className={styles.datumDelta}>
        <Delta val={value} refVal={refVal} id={id} invert={false} />
      </span>
    </span>
  );
};

export default function EmployeeInfo() {
  const { report, refReport } = useReport();
  const employeeData = selectEmployeeCounts(report?.reportData);
  const refData = refReport?.reportData ? selectEmployeeCounts(refReport?.reportData) : undefined;

  return (
    (employeeData && (
      <span className={styles.employeeInfo}>
        <SingleScore
          id={TOTAL_EMPLOYEES}
          title="Total Employees"
          value={employeeData?.total}
          Icon={GroupIcon}
          refVal={refData?.total}
        />
        <SingleScore id={HOME_WORKERS} title="Home" value={employeeData?.home} Icon={HomeIcon} refVal={refData?.home} />
        <SingleScore
          id={OFFICE_WORKERS}
          title="Office"
          value={employeeData?.office}
          Icon={OfficeIcon}
          refVal={refData?.office}
        />
        <SingleScore
          id={HYBRID_WORKERS}
          title="Hybrid"
          value={employeeData?.hybrid}
          Icon={RealEstateIcon}
          refVal={refData?.hybrid}
        />
      </span>
    )) ??
    null
  );
}
