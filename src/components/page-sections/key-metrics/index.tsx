import { useCallback, useMemo, useState } from 'react';
import { ButtonBase } from '@mui/material';
import clsx from 'clsx';
import BusinessBlock from 'src/components/page-sections/report-blocks/business';
import PayrollBlock from 'src/components/page-sections/report-blocks/payroll';
import RevenueBlock from 'src/components/page-sections/report-blocks/revenue';
import Wellbeing from 'src/components/page-sections/report-blocks/wellbeing';
import { KeyMetricContext, KEY_METRIC_TOOLTIPS } from 'src/constants/display';
import useReport from 'src/hooks/use-report';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import { selectMetrics } from 'src/slices/dashboard';
import styles from './key-metrics.module.scss';
import Metric from './metric-tile';

const KeyMetrics = () => {
  const { report, refReport } = useReport();
  const metrics = selectMetrics(report?.reportData);
  const refMetrics = refReport?.reportData ? selectMetrics(refReport?.reportData) : null;

  const [drawerState, setDrawerState] = useState<KeyMetricContext>(KeyMetricContext.NONE);
  const handleSelect = (newDrawerState: KeyMetricContext) =>
    setDrawerState((prevState) => (prevState === newDrawerState ? KeyMetricContext.NONE : newDrawerState));

  const drawerContent = useMemo(() => {
    switch (drawerState) {
      case KeyMetricContext.WELLBEING:
        return <Wellbeing />;
      case KeyMetricContext.EFFICIENCY:
        return <BusinessBlock />;
      case KeyMetricContext.REVENUE:
        return <RevenueBlock />;
      case KeyMetricContext.PAYROLL:
        return <PayrollBlock />;
      case KeyMetricContext.NONE:
      default:
        return null;
    }
  }, [drawerState]);

  if (!metrics) {
    return null;
  }

  return (
    <div className={clsx(styles.keyMetricsWrapper, drawerState !== KeyMetricContext.NONE && styles.drawerOpen)}>
      <div className={styles.metricsCollection}>
        {metrics?.wellbeing ? (
          <ButtonBase
            component="div"
            onClick={() => {
              handleSelect(KeyMetricContext.WELLBEING);
            }}
            key={'wellbeing-metric'}
            classes={{
              root: `${styles.keyMetricButton} MuiButtonBase-root`,
            }}
          >
            <Metric
              id="wellbeing"
              title="Wellbeing"
              value={`${constructValueDisplayString(metrics.wellbeing.value, 1)}%`}
              tooltip={KEY_METRIC_TOOLTIPS.WELLBEING}
              deltaVal={metrics?.wellbeing?.value}
              refVal={refMetrics?.wellbeing?.value}
              suffix={'%'}
              selected={drawerState === KeyMetricContext.WELLBEING}
            />
          </ButtonBase>
        ) : null}
        {metrics?.equality ? (
          <Metric
            id="equality"
            title="Equality"
            value={`Grade ${metrics.equality.value}`}
            tooltip={KEY_METRIC_TOOLTIPS.EQUALITY}
            deltaVal={metrics?.equality?.value?.charCodeAt(0)}
            refVal={refMetrics?.equality?.value?.charCodeAt(0)}
            invert={true}
          />
        ) : null}
        {metrics?.payroll ? (
          <ButtonBase
            component="div"
            onClick={() => {
              handleSelect(KeyMetricContext.PAYROLL);
            }}
            key={'payroll-metric'}
            classes={{
              root: `${styles.keyMetricButton} MuiButtonBase-root`,
            }}
          >
            <Metric
              id="payroll"
              title="Payroll Opportunity"
              value={`${constructValueDisplayString(metrics?.payroll?.value, undefined, undefined, metrics?.currency)}`}
              tooltip={KEY_METRIC_TOOLTIPS.PAYROLL}
              deltaVal={metrics?.payroll?.value}
              refVal={refMetrics?.payroll?.value}
              prefix={metrics.currency ?? '£'}
              selected={drawerState === KeyMetricContext.PAYROLL}
            />
          </ButtonBase>
        ) : null}
        {metrics?.efficiency ? (
          <ButtonBase
            component="div"
            onClick={() => {
              handleSelect(KeyMetricContext.EFFICIENCY);
            }}
            key={'efficiency-metric'}
            classes={{
              root: `${styles.keyMetricButton} MuiButtonBase-root`,
            }}
          >
            <Metric
              id="business"
              title="Business Efficiency"
              value={`${constructValueDisplayString(metrics?.efficiency?.value, 1)} Days`}
              tooltip={KEY_METRIC_TOOLTIPS.EFFICIENCY}
              deltaVal={metrics?.efficiency?.value}
              refVal={refMetrics?.efficiency?.value}
              suffix={' Days'}
              selected={drawerState === KeyMetricContext.EFFICIENCY}
            />
          </ButtonBase>
        ) : null}
        {metrics?.revenue ? (
          <ButtonBase
            component="div"
            onClick={() => {
              handleSelect(KeyMetricContext.REVENUE);
            }}
            key={'revenue-metric'}
            classes={{
              root: `${styles.keyMetricButton} MuiButtonBase-root`,
            }}
          >
            <Metric
              id="revenue"
              title="Revenue Opportunity"
              value={`${constructValueDisplayString(metrics?.revenue?.value, undefined, undefined, metrics?.currency)}`}
              tooltip={KEY_METRIC_TOOLTIPS.REVENUE}
              deltaVal={metrics?.revenue?.value}
              prefix={metrics.currency ?? '£'}
              refVal={refMetrics?.revenue?.value}
              selected={drawerState === KeyMetricContext.REVENUE}
            />
          </ButtonBase>
        ) : null}
      </div>
      {drawerContent}
    </div>
  );
};

export default KeyMetrics;
