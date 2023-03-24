import ChartEmptyState from 'src/components/page-sections/report-blocks/base/chart-empty-state';
import KeyDataTiles from 'src/components/page-sections/report-blocks/base/key-data-tiles';
import baseStyles from 'src/components/page-sections/report-blocks/base/styles.module.scss';
import useReport from 'src/hooks/use-report';
import FrustratedIcon from 'src/icons/report-blocks/frustrated.svg';
import SatisfiedIcon from 'src/icons/report-blocks/satisfied.svg';
import SufferingIcon from 'src/icons/report-blocks/suffering.svg';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import { selectAllReportBlocks } from 'src/slices/dashboard';
import type { BusinessBlockData } from 'src/types/slices';
import BarChart from './chart';
import DaysCalendar from './days-calendar';
import styles from './styles.module.scss';

const BusinessBlock = () => {
  const { report } = useReport();

  const blocks = selectAllReportBlocks(report?.reportData);

  const blockData = blocks?.businessBlockData as BusinessBlockData;

  const keyData = [
    { label: 'Suffering Group', datum: blockData?.metrics.suffering, Icon: SufferingIcon, key: 'business-suffering' },
    {
      label: 'Frustrated Group',
      datum: blockData?.metrics.frustrated,
      Icon: FrustratedIcon,
      key: 'business-frustrated',
    },
    {
      label: 'Satisfied Group',
      datum: blockData?.metrics.satisfied,
      Icon: SatisfiedIcon,
      key: 'business-satisfied',
    },
  ];

  const averageDaysLost = parseFloat(blockData?.metrics?.averageDaysLost?.value as string);

  return (
    <div className={baseStyles.content} id="business" title="Business Efficiency">
      <KeyDataTiles data={keyData} flexBasis={160} />
      <div className={baseStyles.dataSection}>
        <div className={baseStyles.leftColumn}>
          <div className={styles.avgDays}>
            <div className={styles.calendarIcon}>
              <DaysCalendar avgDaysLost={averageDaysLost || 0} />
            </div>
            <div>
              <div className={styles.label}>Average days lost</div>
              <div className={styles.value}>{`${constructValueDisplayString(averageDaysLost || '-')} Days`}</div>
            </div>
          </div>
          <div className={baseStyles.leftColumn__text}>
            <p>{blockData?.subtitle}</p>
            {blockData?.text.map((text: string, idx: number) => (
              <p key={`info-text-${idx}`}>{text}</p>
            ))}
          </div>
        </div>
        <div className={baseStyles.rightColumn}>
          <div className={baseStyles.header}>
            <div className={baseStyles.title}>
              Average days Lost per {blockData?.metrics?.personaTerm?.value || 'Group'}
            </div>
          </div>
          <div className={baseStyles.chartWrapper}>
            {blockData?.chartData ? (
              <BarChart chartData={blockData?.chartData} chartTooltip={blockData?.chartTooltip ?? {}} />
            ) : (
              <ChartEmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessBlock;
