import type { NextPage } from 'next';
import Image from 'next/image';
import Navigation from 'src/components/navigation';
import styles from 'styles/404.module.scss';

const FourOhFour: NextPage = () => {
  return (
    <Navigation>
      <div className={styles.NotFoundBackground}>
        <span className={styles.NotFoundText}>Sorry, page not found!</span>
        <div className={styles.NotFoundImage}>
          <Image src="/assets/not-found/404.svg" layout="fill" alt="Not found" />
        </div>
      </div>
    </Navigation>
  );
};

export default FourOhFour;
