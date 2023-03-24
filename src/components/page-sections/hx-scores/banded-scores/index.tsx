import clsx from 'clsx';
import { BAND_TYPE_FRUSTRATED, BAND_TYPE_SATISFIED, BAND_TYPE_SUFFERING } from 'src/constants/scores';
import useReport from 'src/hooks/use-report';
import { selectBandedScores, selectEmployeeCounts } from 'src/slices/dashboard';
import { BandedScores } from 'src/types/slices';
import Band from './band';
import styles from './band-scores.module.scss';

type BandedScoreProps = {
  employeesPage?: boolean;
  scores?: BandedScores;
};

const BandedScores = (props: BandedScoreProps) => {
  const { report, refReport } = useReport();
  const scores = props.scores ?? selectBandedScores(report?.reportData);
  const refScores =
    props.employeesPage === false && refReport?.reportData ? selectBandedScores(refReport?.reportData) : undefined;

  const total =
    props.employeesPage === false
      ? selectEmployeeCounts(report?.reportData)?.total
      : (scores?.suffering.employeeCount ?? 0) +
        (scores?.frustrated.employeeCount ?? 0) +
        (scores?.satisfied.employeeCount ?? 0);

  const refTotal = refReport?.reportData ? selectEmployeeCounts(refReport?.reportData)?.total : undefined;

  if (!scores || !total) {
    return null;
  }

  return (
    <div className={clsx(styles.bandedScores, props.employeesPage && styles.employeesPage)}>
      <Band
        scores={scores?.suffering}
        refScores={refScores?.suffering}
        employeeTotal={total}
        refTotal={refTotal}
        bandType={BAND_TYPE_SUFFERING}
        employeesPage={props.employeesPage}
      />
      <Band
        scores={scores?.frustrated}
        refScores={refScores?.frustrated}
        employeeTotal={total}
        refTotal={refTotal}
        bandType={BAND_TYPE_FRUSTRATED}
        employeesPage={props.employeesPage}
      />
      <Band
        scores={scores?.satisfied}
        refScores={refScores?.satisfied}
        employeeTotal={total}
        refTotal={refTotal}
        bandType={BAND_TYPE_SATISFIED}
        employeesPage={props.employeesPage}
        invert={true}
      />
    </div>
  );
};

export default BandedScores;
