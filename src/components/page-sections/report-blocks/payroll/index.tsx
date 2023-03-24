import ChartEmptyState from 'src/components/page-sections/report-blocks/base/chart-empty-state';
import KeyDataTiles from 'src/components/page-sections/report-blocks/base/key-data-tiles';
import baseStyles from 'src/components/page-sections/report-blocks/base/styles.module.scss';
import useReport from 'src/hooks/use-report';
import AveragePayroll from 'src/icons/report-blocks/average-payroll.svg';
import TotalPayroll from 'src/icons/report-blocks/total-payroll.svg';
import { selectAllReportBlocks } from 'src/slices/dashboard';
import type { PayrollBlockData } from 'src/types/slices';
import BarChart from './chart';

const PayrollBlock = () => {
  const { report } = useReport();
  const blocks = selectAllReportBlocks(report?.reportData);

  const blockData = blocks?.payrollBlockData as PayrollBlockData;
  const keyData = [
    {
      label: 'Total Payroll Opportunity',
      datum: blockData?.metrics['opportunity'],
      Icon: TotalPayroll,
      key: 'payroll-total',
    },
    {
      label: 'Average payroll Opportunity Per Employee',
      datum: blockData?.metrics['averageOpportunity'],
      Icon: AveragePayroll,
      key: 'payroll-average',
    },
  ];

  return (
    <div className={baseStyles.content} id="payroll" title="Payroll">
      <KeyDataTiles data={keyData} flexBasis={400} />
      <div className={baseStyles.dataSection}>
        <div className={baseStyles.leftColumn}>
          <div className={baseStyles.leftColumn__text}>
            <p>{blockData?.subtitle}</p>
            {blockData?.text.map((text: string, idx: number) => (
              <p key={`info-text-${idx}`}>{text}</p>
            ))}
          </div>
        </div>
        <div className={baseStyles.rightColumn}>
          <div className={baseStyles.header}>
            <div className={baseStyles.title}>Payroll opportunity per employee banding</div>
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

export default PayrollBlock;
