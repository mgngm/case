import QuickReportPicker from 'src/components/header/data-switcher/quick-report-switcher';
import CarbonEmissions from 'src/components/page-sections/carbon-emissions';
import DigitalWorkplace from 'src/components/page-sections/digital-workplace';
import WorkingLocationScores from 'src/components/page-sections/working-location-scores';
import WorstOffices from 'src/components/page-sections/worst-offices';
import styles from './index.module.scss';

const HybridWorking = () => {
  return (
    <div className={styles.hybridMain}>
      <div className={styles.title}>
        <QuickReportPicker />
      </div>
      <div className={styles.pageSections}>
        <DigitalWorkplace />
        <CarbonEmissions />
        <WorkingLocationScores />
        <WorstOffices />
      </div>
    </div>
  );
};

export default HybridWorking;
