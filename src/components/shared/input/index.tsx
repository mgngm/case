import type { InputHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

export type InputProps = {
  endIcon?: ReactNode;
  showClear?: boolean;
  onClear?: MouseEventHandler<HTMLSpanElement>;
  invalid?: boolean;
  iconVariation?: 'normal' | 'outlined';
  classes?: Partial<Record<'input' | 'endIconContainer' | 'endIcon' | 'clearIcon' | 'clearDivider', string>>;
} & InputHTMLAttributes<HTMLInputElement>;

// TODO: work out a simpler way to set an ink colour for this input
// SCSS mixin won't do the trick due to namespaced classes :(
// CSS variable could work but would need to rework how translucent elements calc their colour
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, endIcon, showClear, onClear, invalid, iconVariation = 'normal', classes = {}, ...props }, ref) => (
    <div
      className={clsx(
        styles.input,
        { [styles.hasEndIcon]: !!endIcon, [styles.hasClear]: showClear, [styles.invalid]: invalid },
        className
      )}
    >
      <input className={clsx(styles.inputInput, classes.input)} {...props} ref={ref} />
      {(endIcon || onClear) && (
        <div className={clsx(styles.endIconContainer, classes.endIconContainer)}>
          {endIcon && (
            <span
              className={clsx(styles.endIcon, classes.endIcon, {
                [`material-icons${iconVariation === 'outlined' ? '-outlined' : ''}`]: typeof endIcon === 'string',
              })}
            >
              {endIcon}
            </span>
          )}
          <div className={styles.clearIconContainer}>
            {endIcon && <span className={clsx(styles.clearDivider, classes.clearDivider)} />}
            <span className={clsx(styles.clearIcon, classes.clearIcon, 'material-icons')} onClick={onClear}>
              clear
            </span>
          </div>
        </div>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
