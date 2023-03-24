import type { ButtonBaseProps } from '@mui/material';
import { ButtonBase } from '@mui/material';
import clsx from 'clsx';
import styles from './index.module.scss';

export const TableEmptyBody = ({
  children,
  className,
  bodyClass,
  colSpan = 100,
  ...props
}: {
  bodyClass?: string;
} & JSX.IntrinsicElements['td']) => (
  <tbody className={clsx(styles.emptyBody, bodyClass)}>
    <tr>
      <td className={clsx(styles.emptyCell, className)} colSpan={colSpan} {...props}>
        {children}
      </td>
    </tr>
  </tbody>
);

// i'm a tr playing a ButtonBase disguised as a TableRow
export const ButtonRow = (props: ButtonBaseProps<'tr'>) => <ButtonBase component="tr" {...props} />;
