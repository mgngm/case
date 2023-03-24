import type { ChangeEventHandler, DragEventHandler } from 'react';
import { RemoveCircle } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import type { Draft } from '@reduxjs/toolkit';
import clsx from 'clsx';
import type { Updater } from 'use-immer';
import FileInput from 'src/components/shared/input/file';
import type { ProjectChart } from 'src/types/projects';
import type { KeysMatching } from 'src/types/util';
import type { FormChart } from '.';
import styles from './project-template-dialog.module.scss';

type CreateChartInputProps<FormState> = {
  chart: FormChart;
  index: number;
  updateTemplate: Updater<FormState>;
  selectCharts: (draft: Draft<FormState>) => Draft<FormChart[]> | undefined;
};

const Chart = <FormState,>({ chart, index, updateTemplate, selectCharts }: CreateChartInputProps<FormState>) => {
  const setImage = (image: File) =>
    updateTemplate((draft) => {
      const charts = selectCharts(draft);
      if (charts) {
        charts[index].newImage = image;
      }
    });

  const setValue = (key: KeysMatching<ProjectChart, string>, value: string) =>
    updateTemplate((draft) => {
      const charts = selectCharts(draft);
      if (charts) {
        charts[index][key] = value;
      }
    });

  const handleDrop: DragEventHandler<HTMLLabelElement> = (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className={clsx(styles.formBlockRow, styles.chart)}>
      <div className={styles.cellGroup}>
        <div className={styles.cell}>
          <label htmlFor={`chart-title-${index}`}>Title</label>
        </div>
        <div className={styles.cell}>
          <TextField
            autoComplete="off"
            fullWidth
            id={`chart-title-${index}`}
            onChange={(ev) => setValue('title', ev.target.value)}
            value={chart.title}
          />
        </div>
      </div>
      <div className={clsx(styles.cell, styles.deleteCell)}>
        <IconButton
          color="error"
          id={`delete-chart-${index}`}
          onClick={() =>
            updateTemplate((draft) => {
              selectCharts(draft)?.splice(index, 1);
            })
          }
        >
          <RemoveCircle />
        </IconButton>
      </div>
      <div className={styles.cellGroup}>
        <div className={styles.cell}>
          <label htmlFor={`chart-body-${index}`}>Body</label>
        </div>
        <div className={styles.cell}>
          <TextField
            autoComplete="off"
            fullWidth
            id={`chart-body-${index}`}
            onChange={(ev) => setValue('body', ev.target.value)}
            value={chart.body}
            multiline
            minRows={2}
          />
        </div>
      </div>
      <div className={styles.cellGroup}>
        <div className={styles.cell}>
          <label htmlFor={`chart-image-${index}`}>Image</label>
        </div>
        <div className={styles.cell}>
          {!chart.newImage && chart.imageUrl ? (
            <TextField sx={{ mb: 1 }} value={chart.imageUrl} disabled fullWidth />
          ) : null}
          <FileInput
            id={`chart-image-${index}`}
            accept="image/*"
            value={chart.newImage}
            onDrop={handleDrop}
            onChange={handleChange}
          >
            {chart.imageUrl ? 'Replace' : 'Upload'} chart image
          </FileInput>
        </div>
      </div>
    </div>
  );
};

export default Chart;
