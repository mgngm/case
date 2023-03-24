import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import CountUp from 'react-countup';
import { Delta } from 'src/components/shared/delta';
import useReport from 'src/hooks/use-report';
import { selectHXScore } from 'src/slices/dashboard';
import { drawHXScoreDial } from './graphics';
import styles from './styles.module.scss';

type DialProps = {
  employeesPage?: boolean;
  hxScore?: { value: number };
};

const Dial = (props: DialProps) => {
  const { report, refReport } = useReport();

  const score = props.hxScore ?? selectHXScore(report?.reportData);
  const refScore = refReport?.reportData ? selectHXScore(refReport?.reportData) : null;
  const svg = useRef<SVGSVGElement>(null);
  const scoreVal = score && score?.value > 10 ? 10 : score?.value ?? 0;

  useEffect(() => {
    drawHXScoreDial(svg, scoreVal);
  }, [scoreVal]);

  return (
    <div className={clsx(styles.dialWrapper, props.employeesPage && styles.employeesPage)}>
      <div id="chart" className={styles.dialGraphicWrapper}>
        <svg ref={svg} />
        <div className={styles.innerCurve}>
          <CountUp
            className={styles.HXScore}
            start={0}
            end={scoreVal}
            decimals={scoreVal === 10 ? 0 : 1}
            duration={2}
          />
        </div>
      </div>
      <div className={styles.labels}>
        <div className={styles.HXMin}>0</div>
        <div className={styles.HXMax}>10</div>
      </div>
      <div className={styles.titleWrap}>
        <span className={styles.HXScoreTitle}>HX Score</span>
        {!props.employeesPage && (
          <Delta val={score?.value ?? 0} refVal={refScore?.value} className={styles.dialDelta} id="hx" invert={true} />
        )}
      </div>
    </div>
  );
};

export default Dial;
