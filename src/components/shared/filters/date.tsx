import type { CommonFieldProps } from 'src/components/shared/filters';
import { FormField } from 'src/components/shared/filters';
import type { DatePickerProps } from 'src/components/shared/input/date-picker';
import DatePicker from 'src/components/shared/input/date-picker';
import styles from './index.module.scss';

type DateFieldProps<
  CustomModifierNames extends string = never,
  WithRange extends boolean | undefined = undefined
> = CommonFieldProps & DatePickerProps<CustomModifierNames, WithRange>;

const DateField = <CustomModifierNames extends string = never, WithRange extends boolean | undefined = undefined>({
  title,
  disableReset,
  idPrefix,
  onReset,
  children,
  containerProps,
  inputProps,
  ...props
}: DateFieldProps<CustomModifierNames, WithRange>) => {
  return (
    <FormField {...{ title, disableReset, idPrefix, onReset, containerProps }}>
      <div className={styles.row}>
        <DatePicker {...props} inputProps={{ fullWidth: true, ...inputProps }} />
      </div>
      {children}
    </FormField>
  );
};

export default DateField;
