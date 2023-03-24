import type { ReactNode } from 'react';
import { useState } from 'react';
import type { SliderProps } from '@mui/material';
import { Button, Slider, TextField, Chip } from '@mui/material';
import { shallowEqual } from 'react-redux';
import type { CommonFieldProps } from 'src/components/shared/filters';
import { FormField } from 'src/components/shared/filters';
import type { ModelSizeInput } from 'src/graphql';
import { round } from 'src/logic/libs/helpers';
import styles from './index.module.scss';

type Range = Pick<ModelSizeInput, 'ge' | 'gt' | 'le' | 'lt'>;

type RangeFieldProps = CommonFieldProps & {
  presets?: Record<string, Range>;
  value?: Range;
  onChange?: (size: Range) => void;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

export const RangeField = ({
  title,
  onReset,
  disableReset,
  idPrefix,
  containerProps,
  children,
  presets,
  value,
  onChange,
  min = 0,
  max = 100,
  step,
  disabled,
  startAdornment,
  endAdornment,
  ...props
}: RangeFieldProps & Omit<SliderProps, keyof RangeFieldProps>) => {
  const [customRange, setCustomRange] = useState(true);

  return (
    <FormField {...{ title, idPrefix, containerProps }}>
      {presets && (
        <div className={styles.chipRow}>
          {Object.entries(presets).map(([label, preset]) => (
            <Chip
              key={label}
              label={label}
              id={`${idPrefix}-preset-${label.toLowerCase()}`}
              variant="outlined"
              sx={(theme) => {
                const selected = !customRange && shallowEqual(value, preset);
                return {
                  transition: theme.transitions.create(['color', 'border-color'], {
                    duration: 100,
                  }),
                  color: selected ? theme.palette.primary.main : undefined,
                  borderColor: selected ? theme.palette.primary.main : undefined,
                };
              }}
              onClick={() => {
                setCustomRange(false);
                onChange?.(preset);
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor={idPrefix + '-min'}>Min:</label>
          <TextField
            type="number"
            id={idPrefix + '-min'}
            inputProps={{ min, max, step: step ?? 1 }}
            InputProps={{ startAdornment, endAdornment }}
            value={value?.ge ?? value?.gt ?? min}
            onChange={(e) => {
              const { ge, le } = { ge: round(parseFloat(e.target.value), 1), le: value?.le ?? value?.lt };
              if (ge === min && le === max) {
                onReset?.();
              } else {
                setCustomRange(true);
                onChange?.({ ge, le });
              }
            }}
            disabled={disabled}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor={idPrefix + '-max'}>Max:</label>
          <TextField
            type="number"
            id={idPrefix + '-max'}
            inputProps={{ min, max, step: step ?? 1 }}
            InputProps={{ startAdornment, endAdornment }}
            value={value?.le ?? value?.lt ?? max}
            onChange={(e) => {
              const { ge, le } = { le: round(parseFloat(e.target.value), 1), ge: value?.ge ?? value?.gt };
              if (ge === min && le === max) {
                onReset?.();
              } else {
                setCustomRange(true);
                onChange?.({ ge, le });
              }
            }}
            disabled={disabled}
          />
        </div>
        <Button color="error" id={idPrefix + '-reset'} sx={{ ml: 'auto' }} disabled={disableReset} onClick={onReset}>
          Reset
        </Button>
      </div>
      <div className={styles.row}>
        <Slider
          value={[value?.ge ?? value?.gt ?? min, value?.le ?? value?.lt ?? max]}
          disabled={disabled}
          {...{ min, max, step }}
          {...props}
          onChange={(e, value) => {
            if (!Array.isArray(value)) {
              return;
            }
            const [ge, le] = value;
            if (ge === min && le === max) {
              onReset?.();
            } else {
              setCustomRange(true);
              onChange?.({ ge, le });
            }
          }}
        />
      </div>
      {children}
    </FormField>
  );
};
