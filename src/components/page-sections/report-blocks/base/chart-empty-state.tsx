import clsx from 'clsx';
import chartStyles from './bar-chart.module.scss';

const ChartEmptyState = () => (
  <div className={clsx(chartStyles.chartAreaWrapper, chartStyles.emptyWrapper)}>
    <span className={chartStyles.emptyState}>There is no available data for this chart.</span>
  </div>
);

export default ChartEmptyState;
