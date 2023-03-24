import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './page-section.module.scss';

export default function PageSection({
  title,
  children,
  className,
  id,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={clsx(styles.pageSection, className)} id={id}>
      {title && <div className={styles.title}>{title}</div>}
      {children}
    </div>
  );
}
