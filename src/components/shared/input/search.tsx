import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import Input from 'src/components/shared/input';
import styles from './search.module.scss';

export const SearchInput = ({
  id,
  value,
  className,
  placeholder,
  isSearching,
  onChange,
  onClear,
  ...props
}: {
  value: string;
  isSearching: boolean;
  onClear: () => void;
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Input
      {...props}
      className={clsx(styles.search, className)}
      classes={{ input: styles.input, endIcon: styles.endIcon, clearIcon: styles.clearIcon }}
      placeholder={placeholder ?? 'Search...'}
      value={value}
      onChange={onChange}
      endIcon={isSearching ? 'pending' : 'search'}
      iconVariation="outlined"
      showClear={!!value}
      onClear={onClear}
      id={id}
      autoComplete="off"
    />
  );
};
