import { RemoveCircle } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import type { Draft } from '@reduxjs/toolkit';
import clsx from 'clsx';
import type { Updater } from 'use-immer';
import type { ProjectMetric } from 'src/types/projects';
import styles from './project-template-dialog.module.scss';

type KeyMetricInputProps<FormState> = {
  metric: ProjectMetric;
  index: number;
  updateTemplate: Updater<FormState>;
  selectMetrics: (draft: Draft<FormState>) => ProjectMetric[] | undefined;
};

const KeyMetric = <FormState,>({ metric, index, updateTemplate, selectMetrics }: KeyMetricInputProps<FormState>) => (
  <div className={clsx(styles.formBlockRow, styles.metric)}>
    <div className={styles.cell}>
      <label htmlFor={`metric-text-${index}`}>Metric</label>
    </div>
    <div className={styles.cell}>
      <TextField
        autoComplete="off"
        fullWidth
        id={`metric-text-${index}`}
        onChange={(ev) =>
          updateTemplate((draft) => {
            const keyMetrics = selectMetrics(draft);
            if (keyMetrics) {
              keyMetrics[index].text = ev.target.value;
            }
          })
        }
        value={metric.text}
      />
    </div>
    <div className={clsx(styles.cell, styles.deleteCell)}>
      <IconButton
        color="error"
        onClick={() =>
          updateTemplate((draft) => {
            selectMetrics(draft)?.splice(index, 1);
          })
        }
        id="remove-key-metric-button"
      >
        <RemoveCircle />
      </IconButton>
    </div>
  </div>
);

export default KeyMetric;
