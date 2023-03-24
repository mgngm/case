import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Button } from '@mui/material';
import clsx from 'clsx';
import styles from './index.module.scss';

export type CommonFieldProps = {
  title: ReactNode;
  disableReset?: boolean;
  onReset?: () => void;
  idPrefix: string;
  children?: ReactNode;
  containerProps?: ComponentPropsWithoutRef<'div'>;
};

export const FormField = ({ title, disableReset, idPrefix, onReset, children, containerProps }: CommonFieldProps) => (
  <div {...containerProps} className={clsx(styles.group, containerProps?.className)}>
    <div className={styles.row}>
      <h4 className={styles.subtitle}>{title}</h4>
      {onReset && (
        <Button
          color="error"
          id={idPrefix + 'reset'}
          sx={{ ml: 'auto' }}
          disabled={disableReset}
          onClick={() => !disableReset && onReset()}
        >
          Reset
        </Button>
      )}
    </div>
    {children}
  </div>
);
