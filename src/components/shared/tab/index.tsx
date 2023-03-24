import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

export type TabProps = {
  selected?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Tab = ({ selected, className, ...props }: TabProps) => (
  <button className={clsx(styles.tab, { [styles.selected]: selected }, className)} {...props} />
);

export const TabContainer = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.tabContainer, className)} {...props} />
);

export default Tab;
