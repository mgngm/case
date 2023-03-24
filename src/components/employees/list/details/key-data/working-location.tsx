import donutStyles from 'src/components/page-sections/working-location-scores/working-location-scores.module.scss';
import { BAND_CONSTANTS, BAND_TYPE_FRUSTRATED, BAND_TYPE_SATISFIED, BAND_TYPE_SUFFERING } from 'src/constants/scores';
import type { DU } from 'src/graphql';
import HomeIcon from 'src/icons/general/home.svg';
import OfficeIcon from 'src/icons/general/office.svg';
import RealEstateIcon from 'src/icons/general/real-estate.svg';
import KeyDataDonut from './donut';
import styles from './key-data.module.scss';

type WorkingLocationProps = {
  employee: DU;
};

type DonutProps = {
  score: number;
  type: string;
};

const DonutIcon = ({ type }: { type: string }) => {
  let Icon = RealEstateIcon;

  if (type === OFFICE) {
    Icon = OfficeIcon;
  }

  if (type === HOME) {
    Icon = HomeIcon;
  }

  return <Icon size={20} />;
};

const OVERALL = 'overall';
const HOME = 'home';
const OFFICE = 'office';
const DONUT_TITLES: Record<string, string> = {
  [OVERALL]: 'Overall HX',
  [HOME]: 'Remote HX',
  [OFFICE]: 'Office HX',
};

const Donut = ({ score, type }: DonutProps) => {
  let color = donutStyles.overviewSummaryColorBad;
  let text = BAND_TYPE_SUFFERING;
  if (score < 0) {
    color = '';
  } else if (score >= 8) {
    text = BAND_TYPE_SATISFIED;
    color = donutStyles.overviewSummaryColorGood;
  } else if (score >= 5) {
    color = donutStyles.overviewSummaryColorOK;
    text = BAND_TYPE_FRUSTRATED;
  }

  return (
    <div className={styles.workingLocationDonut}>
      <div className={styles.workingLocationDonutIcon}>
        <DonutIcon type={type} />
      </div>
      <div className={styles.workingLocationDonutTitle}>
        <span>{DONUT_TITLES[type]}</span>
      </div>
      <KeyDataDonut score={score} />
      <div className={donutStyles.workingLocationSummary}>
        <div className={color} />
        {score < 0 ? 'Score Not Available' : BAND_CONSTANTS[text].title}
      </div>
    </div>
  );
};

const WorkingLocation = ({ employee }: WorkingLocationProps) => {
  return (
    <div className={styles.workingLocationInner}>
      <div className={styles.subtitle}>HX Score by Working Location</div>
      <div className={styles.workingLocationDonuts}>
        <Donut score={employee.hxScore ?? -1} type={OVERALL} />
        <Donut score={employee.officeHx ?? -1} type={OFFICE} />
        <Donut score={employee.remoteHx ?? -1} type={HOME} />
      </div>
    </div>
  );
};

export default WorkingLocation;
