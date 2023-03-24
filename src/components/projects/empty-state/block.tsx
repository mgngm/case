import type { ReactNode } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import styles from 'src/components/projects/projects.module.scss';

const EmptyBlock = ({ children }: { children: ReactNode }) => (
  <div className={styles.emptyBlockWrapper} id="empty-block">
    <div className={styles.emptyBlockIcon}>
      <ErrorIcon />
    </div>
    <p>{children}</p>
  </div>
);

export default EmptyBlock;
