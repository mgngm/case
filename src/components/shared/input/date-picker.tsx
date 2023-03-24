import { CalendarToday, DateRange, NavigateBefore, NavigateNext } from '@mui/icons-material';
import type { TextFieldProps } from '@mui/material';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import clsx from 'clsx';
import type { ReactDatePickerProps } from 'react-datepicker';
import RDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { satisfies } from 'src/logic/libs/helpers';
import styles from './date-picker.module.scss';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type DatePickerHeaderProps = Parameters<NonNullable<ReactDatePickerProps['renderCustomHeader']>>[0] & {
  monthsShown?: number;
};

const DatePickerHeader = ({
  monthDate,
  increaseMonth,
  decreaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  customHeaderCount,
  monthsShown = 1,
}: DatePickerHeaderProps) => {
  return (
    <div className={clsx(styles.header, { [styles.multi]: monthsShown > 1 })}>
      {customHeaderCount === 0 && (
        <IconButton
          size="small"
          className={styles.headerButton}
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        >
          <NavigateBefore />
        </IconButton>
      )}
      <span className={styles.headerDate}>
        {months[monthDate.getMonth()]} {monthDate.getFullYear()}
      </span>
      {customHeaderCount + 1 === monthsShown && (
        <IconButton
          size="small"
          className={styles.headerButton}
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
        >
          <NavigateNext />
        </IconButton>
      )}
    </div>
  );
};

export type DatePickerProps<
  CustomModifierNames extends string = never,
  WithRange extends boolean | undefined = undefined
> = ReactDatePickerProps<CustomModifierNames, WithRange> & {
  inputProps?: TextFieldProps;
};

const defaultInputProps = (isRange?: boolean) =>
  satisfies<TextFieldProps>()({
    InputProps: {
      startAdornment: <InputAdornment position="start">{isRange ? <DateRange /> : <CalendarToday />}</InputAdornment>,
    },
  });

const DatePicker = <CustomModifierNames extends string = never, WithRange extends boolean | undefined = undefined>({
  inputProps,
  popperClassName,
  calendarClassName,
  monthsShown,
  renderDayContents = (day) => <span className={styles.day}>{day}</span>,
  renderCustomHeader = (props) => <DatePickerHeader {...props} monthsShown={monthsShown} />,
  dateFormat = 'dd/MM/yyyy',
  onChange,
  onChangeRaw,
  selectsRange,
  customInput = (
    <TextField
      {...defaultInputProps(selectsRange)}
      {...inputProps}
      InputProps={{ ...defaultInputProps(selectsRange).InputProps, ...inputProps?.InputProps }}
    />
  ),
  ...props
}: DatePickerProps<CustomModifierNames, WithRange>) => {
  return (
    <RDatePicker
      {...props}
      {...{
        monthsShown,
        renderCustomHeader,
        renderDayContents,
        customInput,
        dateFormat,
        onChange,
        onChangeRaw,
        selectsRange,
        ...(selectsRange && {
          onChangeRaw: (e) => {
            onChangeRaw?.(e);
            // workaround for not being able to type ranges normally
            if (e.target.value) {
              const dates = e.target.value
                .split(' - ')
                .map((date) => {
                  const [dd = '', mm = '', yyyy = ''] = date.split('/');
                  const d = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
                  return !Number.isNaN(d.valueOf()) ? d : null;
                })
                .slice(0, 2);
              if (dates.length === 1) {
                dates.push(null);
              }
              // the event is the wrong type but i think the chances of somebody depending on that are low
              // @ts-expect-error proving to typescript that we're only calling this when withrange is true is more pain than it's worth
              onChange(dates, e);
            }
          },
        }),
      }}
      popperClassName={clsx(styles.popper, popperClassName)}
      calendarClassName={clsx(styles.calendar, calendarClassName)}
    />
  );
};

export default DatePicker;
