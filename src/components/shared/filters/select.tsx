import type { ReactNode } from 'react';
import { useCallback } from 'react';
import type { NoInfer } from '@aws-amplify/ui';
import type { ChipProps, MenuItemProps, SelectProps } from '@mui/material';
import { Chip, MenuItem, Select } from '@mui/material';
import { memoizeWithArgs } from 'proxy-memoize';
import type { CommonFieldProps } from 'src/components/shared/filters';
import { FormField } from 'src/components/shared/filters';
import type { EnumLike, WithKey } from 'src/types/util';
import styles from './index.module.scss';

type SelectChipsProps<Value extends string> = {
  onChipDelete?: (value: NoInfer<Value>, index: number) => void;
  labels?: Partial<Record<NoInfer<Value>, string>>;
  selected: Value[];
  chipProps?: ChipProps | ((value: NoInfer<Value>, index: number) => ChipProps);
};

export const SelectChips = <Value extends string>({
  selected,
  onChipDelete,
  labels,
  chipProps,
}: SelectChipsProps<Value>) => (
  <div className={styles.chipContainer}>
    {selected.map((value, index) => (
      <Chip
        key={value}
        label={labels?.[value] || value}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        {...(onChipDelete && { onDelete: () => onChipDelete?.(value, index) })}
        {...(typeof chipProps === 'function' ? chipProps(value, index) : chipProps)}
      />
    ))}
  </div>
);

type SelectFormProps = CommonFieldProps & {
  children?: ReactNode;
  options: WithKey<MenuItemProps>[];
};

export const SelectField = <T,>({
  title,
  onReset,
  disableReset,
  idPrefix,
  options,
  containerProps,
  children,
  ...props
}: SelectFormProps & Omit<SelectProps<T>, keyof SelectFormProps>) => (
  <FormField {...{ title, onReset, disableReset, idPrefix, containerProps }}>
    <div className={styles.row}>
      <Select fullWidth {...props}>
        {options.map(({ key, ...opt }) => (
          <MenuItem key={key} {...opt} />
        ))}
      </Select>
    </div>
    {children}
  </FormField>
);

type EnumFormProps<Enum extends EnumLike, Multi extends boolean = false> = {
  enum: Enum;
  labels: Record<Enum[keyof Enum], string>;
  multiple?: Multi;
} & Omit<SelectFormProps, 'options'>;

export const EnumField = <Enum extends EnumLike, Multi extends boolean = false>({
  enum: inputEnum,
  labels,
  ...props
}: EnumFormProps<Enum, Multi> &
  Omit<SelectProps<Multi extends true ? Enum[keyof Enum][] : Enum[keyof Enum]>, keyof EnumFormProps<Enum, Multi>>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enumToItems = useCallback(
    memoizeWithArgs(
      <Enum extends EnumLike>(inputEnum: Enum, labels: Record<Enum[keyof Enum], string>): WithKey<MenuItemProps>[] =>
        Object.values(inputEnum).map((val) => ({
          key: val,
          value: val,
          children: labels[val as Enum[keyof Enum]],
        }))
    ),
    []
  );
  return <SelectField {...props} options={enumToItems(inputEnum, labels)} />;
};
