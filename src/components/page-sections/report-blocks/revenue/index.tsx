import ChartEmptyState from 'src/components/page-sections/report-blocks/base/chart-empty-state';
import KeyDataTiles from 'src/components/page-sections/report-blocks/base/key-data-tiles';
import baseStyles from 'src/components/page-sections/report-blocks/base/styles.module.scss';
import useReport from 'src/hooks/use-report';
import AverageRevenue from 'src/icons/report-blocks/average-rev.svg';
import TotalRevenue from 'src/icons/report-blocks/total-rev.svg';
import { selectAllReportBlocks } from 'src/slices/dashboard';

import type { RevenueBlockData } from 'src/types/slices';
import BarChart from './chart';

const RevenueBlock = () => {
  const { report } = useReport();
  const blocks = selectAllReportBlocks(report?.reportData);

  const blockData = blocks?.revenueBlockData as RevenueBlockData;

  const keyData = [
    {
      label: 'Total Revenue Opportunity',
      datum: blockData?.metrics['opportunity'],
      Icon: TotalRevenue,
      key: 'revenue-total',
    },
    {
      label: 'Average revenue opportunity for all employees',
      datum: blockData?.metrics['averageOpportunity'],
      Icon: AverageRevenue,
      key: 'revenue-average',
    },
  ];

  return (
    <div className={baseStyles.content} id="revenue" title="Revenue Opportunity">
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
            <div className={baseStyles.title}>Revenue Opportunity per Department</div>
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

export default RevenueBlock;
