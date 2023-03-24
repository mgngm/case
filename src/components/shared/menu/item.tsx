import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './item.module.scss';

type MenuItemProps = {
  icon?: ReactNode;
  danger?: true;
  selected?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const MenuItem = ({ className, children, icon, danger, selected, ...props }: MenuItemProps) => (
  <div className={clsx(styles.item, className, { [styles.danger]: danger, [styles.selected]: selected })} {...props}>
    {icon && <span className={clsx(styles.icon, 'material-icons')}>{icon}</span>}
    {children}
  </div>
);

export default MenuItem;
