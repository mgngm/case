import BandedScores from './banded-scores';
import Dial from './dial';
import styles from './styles.module.scss';

const HXScores = () => {
  return (
    <div>
      <div className={styles.hxGraphicsWrapper}>
        <Dial />
        <BandedScores />
      </div>
    </div>
  );
};

export default HXScores;
