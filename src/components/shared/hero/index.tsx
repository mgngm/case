import type { ComponentType, ReactNode } from 'react';
import clsx from 'clsx';
import { Delta } from 'src/components/shared/delta';
import { nonNullable } from 'src/logic/libs/helpers';
import styles from './hero.module.scss';

export type HeroProps = {
  title: ReactNode;
  icon?: ComponentType<{ className: string }>;
  subtitle: ReactNode;
  large?: boolean;
  className?: string;
  id?: string;
  value?: number;
  deltaValue?: number | null;
  deltaString?: string | null;
  invert?: boolean;
};

const Hero = ({
  title,
  icon: Icon,
  subtitle,
  large,
  className,
  id,
  value,
  deltaValue,
  deltaString,
  invert = false,
}: HeroProps) => (
  <div className={clsx(styles.heroWrapper, className)} id={id}>
    <div className={clsx(styles.hero, large && styles.large)}>
      {Icon && <Icon className={styles.icon} />}
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <h4 className={styles.subtitle}>{subtitle}</h4>
      </div>
    </div>
    {deltaString && nonNullable(deltaValue) && nonNullable(value) ? (
      <div className={styles.deltaWrapper}>
        <div>
          <span>Last month: </span>
          <span className={styles.deltaRefValue}>{deltaString}</span>
        </div>
        <Delta id={`${id}-delta`} val={value} refVal={deltaValue} invert={invert} />
      </div>
    ) : null}
  </div>
);

export default Hero;
