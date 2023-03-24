import { useEffect, useMemo, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Storage } from 'aws-amplify';
import { useImmer } from 'use-immer';
import { v4 } from 'uuid';
import DialogStyles from 'src/components/admin/context-tab/dialogs/dialogs.module.scss';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import { IMPROVEMENT_STATUS, IMPROVEMENT_TYPE } from 'src/constants/display';
import useAutofocus from 'src/hooks/use-autofocus';
import useContextInfo from 'src/hooks/use-context-info';
import { satisfies } from 'src/logic/libs/helpers';
import { ProjectStatus, ProjectType } from 'src/models';
import { useCreateNewProjectTemplateMutation, useUpdateProjectTemplateMutation } from 'src/slices/project-templates';
import type { ProjectChart, ProjectTemplate } from 'src/types/projects';
import type { Id } from 'src/types/util';
import Chart from './chart';
import KeyMetric from './key-metric';
import styles from './project-template-dialog.module.scss';

type ProjectTemplateDialogProps = {
  open: boolean;
  onClose?: () => void;
  projectTemplate?: ProjectTemplate;
  templateIds?: string[];
};

export type FormChart = Id<ProjectChart & { newImage?: File | undefined }>;

export type FormState = Omit<ProjectTemplate, 'context' | 'body'> & {
  body: Omit<ProjectTemplate['body'], 'charts'> & {
    charts?: Array<FormChart>;
  };
};

const initialState = satisfies<FormState>()({
  name: '',
  body: {
    bodyText: '',
    charts: [],
    keyMetrics: [],
  },
  templateId: '',
  status: ProjectStatus.NOT_STARTED,
  type: ProjectType.APPLICATION,
});

const settableKeys = satisfies<Array<keyof FormState | keyof FormState['body']>>()([
  'name',
  'templateId',
  'status',
  'type',
  'bodyText',
]);

type SettableKeys = typeof settableKeys[number];

type SetOverrides = {
  status: ProjectStatus;
  type: ProjectType;
};

type SettableValue<Key extends SettableKeys> = Key extends keyof SetOverrides
  ? SetOverrides[Key]
  : Key extends keyof FormState
  ? FormState[Key]
  : Key extends keyof FormState['body']
  ? FormState['body'][Key]
  : never;

const ProjectTemplateDialog = ({
  open,
  onClose: propsOnClose,
  projectTemplate,
  templateIds,
}: ProjectTemplateDialogProps) => {
  const [
    {
      name,
      templateId,
      body: { bodyText, charts = [], keyMetrics = [] },
      status,
      type,
    },
    updateTemplate,
  ] = useImmer<FormState>(projectTemplate ?? initialState);
  const setTemplateValue = <Key extends SettableKeys>(key: Key, value: SettableValue<Key>) =>
    updateTemplate((draft) => {
      const k = key as SettableKeys; // generics are weird and don't narrow properly
      if (k === 'bodyText') {
        draft.body[k] = value;
      } else {
        draft[k] = value;
      }
    });
  useEffect(() => {
    updateTemplate(projectTemplate ?? initialState);
  }, [projectTemplate, updateTemplate]);
  const contextInfo = useContextInfo();

  const autofocusRef = useAutofocus(open);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [createProjectTemplate, { isLoading: createLoading }] = useCreateNewProjectTemplateMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const [updateProjectTemplate, { isLoading: editLoading }] = useUpdateProjectTemplateMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });

  const duplicate = projectTemplate ? false : templateIds ? templateIds.includes(templateId) : false;
  const metricsValid = useMemo(() => keyMetrics.every(({ text }) => !!text), [keyMetrics]);
  const chartsValid = useMemo(
    () => charts.every(({ title, imageUrl, newImage }) => title && (imageUrl || newImage)),
    [charts]
  );
  const disabled = !(name && templateId && bodyText && status && type && metricsValid && chartsValid) || duplicate;

  const onClick = async () => {
    // upload images
    setUploadingImages(true);
    const finalCharts = await Promise.all(
      charts.map(async (chart): Promise<ProjectChart> => {
        const { newImage, ...rest } = chart;
        if (newImage) {
          const { imageUrl: oldUrl } = rest;

          ({ key: rest.imageUrl } = await Storage.put(
            `upload/${contextInfo.adminContext.prettyId}/project-templates/${v4()}-${newImage.name}`,
            newImage,
            {
              contentType: newImage.type,
            }
          ));

          if (oldUrl) {
            await Storage.remove(oldUrl);
          }
        }
        return rest;
      })
    );

    setUploadingImages(false);

    // recreate project template object from inputs
    const _projectTemplate: ProjectTemplate = {
      name,
      templateId,
      body: { bodyText, charts: finalCharts, keyMetrics },
      status,
      type,
      context: contextInfo.adminContext.prettyId as string,
    };

    if (projectTemplate) {
      _projectTemplate.id = projectTemplate.id;
      _projectTemplate.version = projectTemplate.version;
    }

    try {
      if (projectTemplate) {
        await updateProjectTemplate({
          projectTemplate: _projectTemplate,
          context: contextInfo.adminContext.prettyId as string,
        }).unwrap();
      } else {
        await createProjectTemplate({
          projectTemplate: _projectTemplate,
          context: contextInfo.adminContext.prettyId as string,
        }).unwrap();
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const onClose = () => {
    propsOnClose?.();
    updateTemplate(initialState);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="project-dialog-title"
      aria-describedby="project-dialog-description"
      scroll="paper"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle className={DialogStyles.dialogTitle} id="project-dialog-title">
        {projectTemplate ? 'Edit' : 'Add'} Project Template
      </DialogTitle>
      <DialogContent>
        <div className={styles.formBlock}>
          <h2 className={styles.subtitle}>Template Settings</h2>
          <div className={styles.formBlockRow}>
            <div className={styles.cell}>
              <label htmlFor="name-field">Name</label>
            </div>
            <div className={styles.cell}>
              <TextField
                autoComplete="off"
                id="name-field"
                ref={autofocusRef}
                className={styles.textInput}
                onChange={(ev) => setTemplateValue('name', ev.target.value)}
                value={name}
                fullWidth
              />
            </div>
          </div>
          <div className={styles.formBlockRow}>
            <div className={styles.cell}>
              <label htmlFor="templateId-field">Template ID</label>
            </div>
            <div className={styles.cell}>
              <TextField
                autoComplete="off"
                id="templateId-field"
                className={styles.textInput}
                onChange={(ev) => setTemplateValue('templateId', ev.target.value)}
                value={templateId}
                fullWidth
                color={!projectTemplate && duplicate ? 'error' : undefined}
                disabled={!!projectTemplate}
              />
              {!projectTemplate && duplicate && (
                <p id="duplicate-template-warning" className={styles.warning}>
                  A template with this ID already exists.
                </p>
              )}
            </div>
          </div>
          <div className={styles.formBlockRow}>
            <div className={styles.cell}>
              <label htmlFor="status-select">Status</label>
            </div>
            <div className={styles.cell}>
              <Select
                labelId="status-select-label"
                id="status-select"
                MenuProps={{ id: 'status-select-menu' }}
                value={status}
                label=""
                onChange={(e) => setTemplateValue('status', e.target.value as ProjectStatus)}
                fullWidth
              >
                {Object.values(ProjectStatus).map((projectStatus) => (
                  <MenuItem key={projectStatus} value={projectStatus}>
                    {IMPROVEMENT_STATUS[projectStatus]}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className={styles.formBlockRow}>
            <div className={styles.cell}>
              <label htmlFor="type-select">Type</label>
            </div>
            <div className={styles.cell}>
              <Select
                labelId="type-select-label"
                id="type-select"
                MenuProps={{ id: 'type-select-menu' }}
                value={type}
                label=""
                onChange={(e) => setTemplateValue('type', e.target.value as ProjectType)}
                fullWidth
              >
                {Object.values(ProjectType).map((projectType) => (
                  <MenuItem key={projectType} value={projectType}>
                    {IMPROVEMENT_TYPE[projectType]}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className={styles.formBlockRow}>
            <div className={styles.cell}>
              <label htmlFor="body-field">Body</label>
            </div>
            <div className={styles.cell}>
              <TextField
                autoComplete="off"
                id="body-field"
                onChange={(ev) => setTemplateValue('bodyText', ev.target.value)}
                value={bodyText}
                multiline
                minRows={2}
                fullWidth
              />
            </div>
          </div>
        </div>
        <div className={styles.formBlock}>
          <h2 className={styles.subtitle} id="key-metrics-title">
            Key Metrics <span className={styles.subtitleHighlight}>({keyMetrics.length})</span>
          </h2>
          {keyMetrics.length ? (
            <>
              {keyMetrics.map((metric, index) => (
                <KeyMetric
                  key={index}
                  selectMetrics={(draft) => draft.body.keyMetrics}
                  {...{ metric, index, updateTemplate }}
                />
              ))}
            </>
          ) : (
            <div className={styles.emptyRow} id="project-template-empty-key-metric">
              No key metrics added
            </div>
          )}
          <div className={styles.actions}>
            <Button
              variant="contained"
              id="create-project-template-add-key-metric-button"
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                updateTemplate((draft) => {
                  (draft.body.keyMetrics ??= []).push({ text: 'New Key Metric' });
                });
              }}
            >
              Add New Metric
            </Button>
          </div>
        </div>
        <div className={styles.formBlock}>
          <h2 className={styles.subtitle} id="charts-title">
            Charts <span className={styles.subtitleHighlight}>({charts.length})</span>
          </h2>
          {charts.length ? (
            <>
              {charts.map((chart, index) => (
                <Chart key={index} selectCharts={(draft) => draft.body.charts} {...{ chart, index, updateTemplate }} />
              ))}
            </>
          ) : (
            <div className={styles.emptyRow} id="project-template-empty-chart">
              No charts added
            </div>
          )}
          <div className={styles.actions}>
            <Button
              variant="contained"
              id="create-project-template-add-chart-button"
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                updateTemplate((draft) => {
                  (draft.body.charts ??= []).push({ title: '', body: '', imageUrl: '' });
                });
              }}
            >
              Add New Chart
            </Button>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          id="create-project-template-close-button"
          variant="outlined"
          onClick={() => {
            onClose();
            updateTemplate(projectTemplate ?? initialState);
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          id="create-project-template-submit-button"
          loading={createLoading || editLoading || uploadingImages}
          loadingIndicator={<ButtonLoadingIndicator />}
          variant="contained"
          disabled={disabled}
          onClick={onClick}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectTemplateDialog;
