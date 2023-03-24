import { useMemo } from 'react';
import ChartEmptyState from 'src/components/page-sections/report-blocks/base/chart-empty-state';
import KeyDataTiles from 'src/components/page-sections/report-blocks/base/key-data-tiles';
import baseStyles from 'src/components/page-sections/report-blocks/base/styles.module.scss';
import TooltipTarget from 'src/components/shared/tooltip-target';
import {
  CO2_REDUCTION_LABEL,
  CO2_WELLBEING_AVERAGE_TOOLTIP,
  CO2_WELLBEING_HEADLINE_TOOLTIP,
} from 'src/constants/display';
import useReport from 'src/hooks/use-report';
import Co2 from 'src/icons/report-blocks/CO2.svg';
import DaysLost from 'src/icons/report-blocks/days-lost.svg';
import PayrollLost from 'src/icons/report-blocks/payroll-lost.svg';
import RevenuOpp from 'src/icons/report-blocks/revenue-opportunity.svg';
import { formatDataForWellbeingOverviewChart } from 'src/logic/libs/charts/wellbeing';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import { selectBandedScores, selectAllReportBlocks, selectEmployeeCounts, selectMetrics } from 'src/slices/dashboard';
import WellbeingChart from './chart';
import SufferingRadial from './suffering-radial';
import styles from './wellbeing.module.scss';

const Wellbeing = () => {
  const { report } = useReport();
  const blocks = selectAllReportBlocks(report?.reportData);
  const employeeCounts = selectEmployeeCounts(report?.reportData);
  const scores = selectBandedScores(report?.reportData);
  const topLevelMetrics = selectMetrics(report?.reportData);

  const blockData = blocks?.wellbeingBlockData;
  const tableInfo = blockData?.table;
  const totalEmployees = employeeCounts?.total;
  const sufferingEmployeeCount = scores?.suffering?.employeeCount;
  const sufferingPercentage = parseFloat((((sufferingEmployeeCount ?? 1) / (totalEmployees ?? 1)) * 100).toFixed(1));
  /**
   * Keep key here for the tiles here to pull correct data and display correct icons etc.
   */
  const keyData = [
    {
      // nb: in deference to the parsed data structure, here we now display total days lost (ie, the top level business efficiency metric) and
      // show the key data "average days lost" that used to be here in the tableInfo beside the visualisation
      label: 'Total Days Lost',
      datum:
        sufferingPercentage > 0 && typeof topLevelMetrics?.efficiency.value === 'number'
          ? { value: topLevelMetrics?.efficiency.value, suffix: 'Days' }
          : undefined,
      Icon: DaysLost,
      key: 'wellbeing-average',
    },
    { label: 'Payroll Lost', datum: blockData?.metrics['payrollLost'], Icon: PayrollLost, key: 'wellbeing-payroll' },
    {
      label: 'Revenue Opportunity',
      datum: blockData?.metrics['revenueOpportunity'],
      Icon: RevenuOpp,
      key: 'wellbeing-revenue',
    },
    {
      label: CO2_REDUCTION_LABEL,
      datum: blockData?.metrics['carbonReduction'],
      Icon: Co2,
      tooltip: CO2_WELLBEING_HEADLINE_TOOLTIP,
      key: 'wellbeing-co2',
    },
  ];

  const chartData = useMemo(() => {
    if (blockData?.chartData) {
      return formatDataForWellbeingOverviewChart(blockData?.chartData);
    } else {
      return null;
    }
  }, [blockData?.chartData]);

  const tableRows = useMemo(() => {
    return [
      { ...(blockData?.metrics.averageDaysLost ?? { value: 0 }), label: 'Days Lost' },
      ...(tableInfo?.rows ?? []),
    ];
  }, [tableInfo?.rows, blockData?.metrics.averageDaysLost]);

  return (
    <div className={baseStyles.content} id="wellbeing" title="Wellbeing">
      <KeyDataTiles data={keyData} />
      <div className={baseStyles.dataSection}>
        <div className={baseStyles.leftColumn}>
          <div>
            <div className={styles.radial__title}>Suffering Employees</div>
            <SufferingRadial percentage={sufferingPercentage || 0} employeeCount={sufferingEmployeeCount ?? 0} />
          </div>
        </div>
        <div className={baseStyles.rightColumn}>
          {chartData && chartData.totalEmployees > 0 ? <WellbeingChart data={chartData} /> : <ChartEmptyState />}
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.info__text}>
          <p>{blockData?.subtitle}</p>
          {Array.isArray(blockData?.text) &&
            blockData?.text.map((text: string, idx: number) => <p key={`info-text-${idx}`}>{text}</p>)}
        </div>
        {tableInfo ? (
          <div className={styles.info__tableInfo}>
            <div className={styles.info__tableInfo__heading}>{tableInfo?.title}</div>
            {tableRows.map(({ value, label, prefix, suffix }) => {
              let displayVal: string | number = value as number;
              let _suffix = suffix || '';
              //RELEASE WEEK HACKS !!!! Hide value, prefix & suffix if negative value.
              if (displayVal === -1) {
                _suffix = '';
                prefix = '';
                displayVal = 'N/A';
              }
              /*
              //If we are looking at the CarbonReduction tile (this is the only override) t
              if (label === CO2_REDUCTION_LABEL) {
                //If it's a tiny value, we want to display it in kg rather than tonnes. Use the 0.02 so something like 0.013 gets correctly adjusted
                if (typeof displayVal !== 'string' && displayVal < 0.02) {
                  displayVal *= 1000;
                  _suffix = 'kg'; //This should change from tonnes to kg
                }
              }
              */

              return (
                <div key={label}>
                  <div className={styles.info__tableInfo__label}>
                    {label}
                    {label === CO2_REDUCTION_LABEL ? <TooltipTarget tooltip={CO2_WELLBEING_AVERAGE_TOOLTIP} /> : null}
                  </div>
                  <div className={styles.info__tableInfo__value}>
                    {`${constructValueDisplayString(displayVal, undefined, undefined, prefix)} ${_suffix}`}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Wellbeing;
