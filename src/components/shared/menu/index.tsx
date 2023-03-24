import type { HTMLAttributes } from 'react';
import { useRef } from 'react';
import clsx from 'clsx';
import useDelayedValue from 'src/hooks/use-delayed-value';
import useOnClickOutside from 'src/hooks/use-on-click-outside';
import styles from './index.module.scss';

export const MenuAnchor = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.menuAnchor, className)} {...props} />
);

type Anchor = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

type MenuProps = { anchor?: Anchor; open?: boolean; onClose?: () => void } & HTMLAttributes<HTMLDivElement>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Menu = ({ className, anchor = 'bottomRight', open = false, onClose = () => {}, ...props }: MenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const delayedOpen = useDelayedValue(open, parseInt(styles.exitTime.replace('ms', '')), { instant: [true] });
  useOnClickOutside(ref, onClose);
  return delayedOpen ? (
    <div ref={ref} className={clsx(styles.menu, styles[anchor], { [styles.open]: open }, className)} {...props} />
  ) : null;
};

export default Menu;
