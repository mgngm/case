import type { CountUpProps } from 'react-countup';
import CountUp from 'react-countup';
import { constructValueDisplayString } from 'src/logic/libs/helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExactlyOneKey<K extends keyof any, V, KK extends keyof any = K> = {
  [P in K]: { [Q in P]: V } & { [Q in Exclude<KK, P>]?: never } extends infer O ? { [Q in keyof O]: O[Q] } : never;
}[K];

export default function FormattedCountUp({
  start = 0,
  value,
  end = value ?? 0,
  decimals = 1,
  duration = 2,
  formattingFn = (val: number) => constructValueDisplayString(val),
  ...props
}: ExactlyOneKey<'value' | 'end', number> & Omit<CountUpProps, 'end'>) {
  return <CountUp {...{ start, end, decimals, duration, formattingFn }} {...props} />;
}
