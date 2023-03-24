import type { ChangeEvent } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Input from 'src/components/shared/input';
import { DEFAULT_HYBRID_LOWER_PERCENT, DEFAULT_HYBRID_UPPER_PERCENT, DEFAULT_WORKING_DAYS } from 'src/constants/levers';
import type { Levers } from 'src/types/csv';
import styles from './levers.module.scss';

const LeverInput = ({
  label,
  name,
  defaultValue,
  help,
  value,
  onChange,
  min,
  max,
  unit,
  iconFill = 'black',
}: {
  label: string;
  name: string;
  defaultValue?: number;
  value?: number;
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
  help?: string;
  min?: number;
  max?: number;
  unit?: string;
  iconFill?: 'black' | 'white';
}) => (
  <div className={styles.leversInputWrapper}>
    <div className={styles.preInput}>
      <label htmlFor={name}>{label}:</label>
      {help && (
        <Tooltip id={`${name}-tooltip-text`} title={help} placement="top" arrow>
          <IconButton
            className={`${styles.helpIcon} ${iconFill === 'black' ? styles.helpIconBlack : styles.helpIconWhite}`}
            id={`${name}-tooltip`}
          >
            <HelpIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}
    </div>
    <span className={styles.leversInput}>
      <Input
        className={styles.leversInputInput}
        name={name}
        id={`lever-${name}`}
        type="number"
        min={min ?? 0}
        max={max ?? 100}
        {...(defaultValue && { defaultValue })}
        {...(onChange && { value, onChange })}
        onBlur={(ev) => ev.target.reportValidity()}
      />
      {unit ?? null}
    </span>
  </div>
);

const LeversInputs = ({
  levers,
  setLevers,
  iconFill = 'black',
}: {
  levers?: Levers;
  setLevers?: {
    setHybridUpper: (value: number) => void;
    setHybridLower: (value: number) => void;
    setWorkingDays: (value: number) => void;
  };
  iconFill?: 'black' | 'white';
}) => {
  return (
    <div className={styles.leversWrapper}>
      <LeverInput
        label="Lower hybrid threshold"
        name="hybrid-lower"
        help="Sets the cut-off for remote work, ie if employee spends 5% (1 day a month) or less of the time in the office they will be classed as a remote worker rather than hybrid."
        {...(!setLevers && { defaultValue: DEFAULT_HYBRID_LOWER_PERCENT })}
        {...(setLevers?.setHybridLower && { value: levers?.hybridLower })}
        {...(setLevers?.setHybridLower && {
          onChange: (ev: ChangeEvent<HTMLInputElement>) => {
            setLevers?.setHybridLower(parseFloat(ev.target.value));
          },
        })}
        max={20}
        unit="%"
        iconFill={iconFill}
      />
      <LeverInput
        label="Upper hybrid threshold"
        name="hybrid-upper"
        help="Sets the cut-off for office work, ie if an employee spends 95% (29 days a month) or more of the time in the office they will be classed as an office worker rather than hybrid."
        {...(!setLevers && { defaultValue: DEFAULT_HYBRID_UPPER_PERCENT })}
        {...(setLevers?.setHybridUpper && { value: levers?.hybridUpper })}
        {...(setLevers?.setHybridUpper && {
          onChange: (ev: ChangeEvent<HTMLInputElement>) => setLevers?.setHybridUpper(parseFloat(ev.target.value)),
        })}
        min={80}
        max={100}
        unit="%"
        iconFill={iconFill}
      />
      <LeverInput
        label="Working days per year"
        name="working-days"
        help="Number of days per year worked in the organisation"
        {...(!setLevers && { defaultValue: DEFAULT_WORKING_DAYS })}
        {...(setLevers?.setWorkingDays && { value: levers?.workingDays })}
        {...(setLevers?.setWorkingDays && {
          onChange: (ev: ChangeEvent<HTMLInputElement>) => setLevers?.setWorkingDays(Number(ev.target.value)),
        })}
        min={0}
        max={366}
        iconFill={iconFill}
      />
    </div>
  );
};

export default LeversInputs;
