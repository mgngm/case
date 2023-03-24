import { useCallback, useEffect, useMemo, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, AlertTitle, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { nanoid } from '@reduxjs/toolkit';
import { Storage } from 'aws-amplify';
import { format, isValid, parse } from 'date-fns';
import { useImmer } from 'use-immer';
import type { FormChart } from 'src/components/admin/project-templates/project-template-dialog';
import Chart from 'src/components/admin/project-templates/project-template-dialog/chart';
import KeyMetric from 'src/components/admin/project-templates/project-template-dialog/key-metric';
import dialogStyles from 'src/components/admin/project-templates/project-template-dialog/project-template-dialog.module.scss';
import DatePicker from 'src/components/shared/input/date-picker';
import { IMPROVEMENT_STATUS, IMPROVEMENT_TYPE } from 'src/constants/display';
import type { Project } from 'src/graphql';
import useAutofocus from 'src/hooks/use-autofocus';
import { safeAssign, satisfies, truthy } from 'src/logic/libs/helpers';
import { ProjectType, ProjectStatus } from 'src/models';
import type { CustomProject, ProjectChart } from 'src/types/projects';
import type { Id, OnlyRequiredKeys, PickPartial } from 'src/types/util';

type ProjectDialogProps = {
  open: boolean;
  handleClose: () => void;
  orgId: string;
  reportDate: string;
} & (
  | {
      project: Project;
      customProject?: never;
      onSuccess: (project: Project) => void;
    }
  | {
      project?: never;
      customProject?: { project: CustomProject; index: number };
      onSuccess: (customProject: CustomProject, index?: number) => void;
    }
);

type FormState = Id<
  PickPartial<Omit<CustomProject, 'charts'>, 'keyMetrics'> &
    Pick<
      Project,
      'projectDate' | 'employeeCount' | 'hxScore' | 'payroll' | 'timeLost' | 'projectStatus' | 'projectType'
    > & {
      charts?: FormChart[];
    }
>;

const initialState = satisfies<Required<FormState>>()({
  title: '',
  body: '',
  charts: [],
  keyMetrics: [],
  projectDate: '',
  employeeCount: 0,
  hxScore: 0,
  payroll: 0,
  timeLost: 0,
  projectType: ProjectType.WIDER_NETWORK,
  projectStatus: ProjectStatus.NOT_STARTED,
});

type SettableKeys = Exclude<keyof FormState, 'charts' | 'keyMetrics'>;

type SetOverrides = {
  projectStatus: ProjectStatus;
  projectType: ProjectType;
};

type SettableValue<Key extends SettableKeys> = Key extends keyof SetOverrides
  ? SetOverrides[Key]
  : Key extends keyof FormState
  ? FormState[Key]
  : never;

const keys = satisfies<(keyof FormState & keyof Project)[]>()([
  'projectDate',
  'employeeCount',
  'hxScore',
  'hxScore',
  'payroll',
  'timeLost',
  'projectStatus',
  'projectType',
]);

const projectToFormState = (project: Project): FormState => {
  const base: FormState = {
    ...initialState,
    title: project.projectName ?? '',
    ...Object.fromEntries(keys.map((key) => project[key] != null && ([key, project[key]] as const)).filter(truthy)),
  };

  try {
    const projectBody = JSON.parse(project?.projectBody ?? '{}');
    safeAssign(
      base,
      { body: projectBody.bodyText ?? '' },
      Object.fromEntries(
        satisfies<(keyof FormState)[]>()(['charts', 'keyMetrics'])
          .map((key) => projectBody[key] != null && ([key, projectBody[key]] as const))
          .filter(truthy)
      ) as Partial<Pick<FormState, 'charts' | 'keyMetrics'>>
    );
  } catch (err) {
    console.warn(err);
  }
  return base;
};

const ProjectDialog = ({
  open,
  handleClose,
  onSuccess,
  reportDate,
  orgId,
  customProject,
  project,
}: ProjectDialogProps) => {
  const [projectState, updateProject] = useImmer<FormState>(initialState);

  const autofocusRef = useAutofocus(open);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const setProjectValue = <Key extends SettableKeys>(key: Key, value: SettableValue<Key>) =>
    updateProject((draft) => {
      // @ts-expect-error union not assignable to union fun
      draft[key] = value;
    });

  useEffect(() => {
    updateProject({
      ...initialState,
      ...customProject?.project,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customProject, updateProject]);

  useEffect(() => {
    if (project) {
      updateProject(projectToFormState(project));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const clear = useCallback(() => {
    updateProject(initialState);
    setSaveError('');
  }, [updateProject]);

  const handleSubmit = async () => {
    // upload images
    setUploadingImages(true);
    const charts = await Promise.all(
      projectState.charts?.map(async (chart): Promise<ProjectChart> => {
        const { newImage, ...rest } = chart;
        if (newImage) {
          const { imageUrl: oldUrl } = rest;

          ({ key: rest.imageUrl } = await Storage.put(
            `upload/${orgId}/${reportDate}/projects/${nanoid()}-${newImage.name}`,
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
      }) ?? []
    );

    setUploadingImages(false);

    setIsSaving(true);
    try {
      const {
        title,
        body,
        keyMetrics,
        projectType,
        projectStatus,
        projectDate,
        timeLost,
        hxScore,
        payroll,
        employeeCount,
      } = projectState;
      if (!project) {
        const updatedCustomProject: CustomProject = {
          title,
          body,
          keyMetrics: keyMetrics ?? [],
          charts,
        };
        onSuccess(updatedCustomProject, customProject?.index);
      } else {
        const updatedProject: Project = {
          ...project,
          projectDate,
          projectName: title,
          projectType,
          projectStatus,
          timeLost: Number(timeLost),
          hxScore: Number(hxScore),
          payroll: Number(payroll),
          employeeCount: Number(employeeCount),
          projectBody: JSON.stringify({
            bodyText: body,
            keyMetrics: keyMetrics ?? [],
            charts,
          }),
        };
        onSuccess(updatedProject);
      }
      handleClose();
      clear();
    } catch (err) {
      console.error(err);
      setSaveError('Error: could not save project');
    } finally {
      setIsSaving(false);
    }
  };

  let dialogTitle = 'Add custom project';

  if (customProject || project) {
    dialogTitle = `Edit ${customProject ? 'custom' : ''} project`;
  }

  const date = parse(projectState.projectDate ?? '', 'yyyy-MM-dd', new Date());

  const metricsValid = useMemo(
    () => (projectState.keyMetrics ?? [])?.every(({ text }) => !!text),
    [projectState.keyMetrics]
  );
  const chartsValid = useMemo(
    () => (projectState.charts ?? []).every(({ title, imageUrl, newImage }) => title && (imageUrl || newImage)),
    [projectState.charts]
  );
  const disabled =
    satisfies<OnlyRequiredKeys<FormState>[]>()(['body', 'title']).some((key) => !projectState[key]) ||
    !chartsValid ||
    !metricsValid ||
    date.getFullYear() > 9999;

  return (
    <Dialog
      open={open}
      onClose={() => {
        clear();
        handleClose();
      }}
      aria-labelledby="project-dialog-title"
      aria-describedby="project-dialog-description"
      scroll="paper"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="project-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        {saveError !== '' ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {saveError !== '' && <p>{saveError}</p>}
          </Alert>
        ) : null}
        <div className={dialogStyles.formBlock}>
          <h2 className={dialogStyles.subtitle}>Project Settings</h2>
          <div className={dialogStyles.formBlockRow}>
            <div className={dialogStyles.cell}>
              <label htmlFor="title-field">Title</label>
            </div>
            <div className={dialogStyles.cell}>
              <TextField
                autoComplete="off"
                id="title-field"
                ref={autofocusRef}
                onChange={(ev) => setProjectValue('title', ev.target.value)}
                value={projectState.title}
                fullWidth
              />
            </div>
          </div>
          <div className={dialogStyles.formBlockRow}>
            <div className={dialogStyles.cell}>
              <label htmlFor="body-field">Body</label>
            </div>
            <div className={dialogStyles.cell}>
              <TextField
                autoComplete="off"
                id="body-field"
                onChange={(ev) => setProjectValue('body', ev.target.value)}
                value={projectState.body}
                multiline
                minRows={2}
                fullWidth
              />
            </div>
          </div>
          {project && (
            <>
              <div className={dialogStyles.formBlockRow}>
                <div className={dialogStyles.cell}>
                  <label htmlFor="date-field">Date identified</label>
                </div>
                <div className={dialogStyles.cell}>
                  <DatePicker
                    autoComplete="off"
                    id="date-field"
                    dateFormat="yyyy-MM-dd"
                    onChange={(date) => date && setProjectValue('projectDate', format(date, 'yyyy-MM-dd'))}
                    selected={isValid(date) ? date : new Date()}
                    inputProps={{
                      fullWidth: true,
                    }}
                  />
                </div>
              </div>
              <div className={dialogStyles.formBlockRow}>
                <div className={dialogStyles.cell}>
                  <label htmlFor="employees-field">Employees</label>
                </div>
                <div className={dialogStyles.cell}>
                  <TextField
                    autoComplete="off"
                    id="employees-field"
                    type="number"
                    onChange={(ev) => setProjectValue('employeeCount', Number(ev.target.value))}
                    value={projectState.employeeCount}
                    fullWidth
                  />
                </div>
              </div>
              <div className={dialogStyles.formBlockRow}>
                <div className={dialogStyles.cell}>
                  <label htmlFor="hxScore-field">HX Score</label>
                </div>
                <div className={dialogStyles.cell}>
                  <TextField
                    autoComplete="off"
                    id="hxScore-field"
                    type="number"
                    onChange={(ev) => setProjectValue('hxScore', Number(ev.target.value))}
                    value={projectState.hxScore}
                    fullWidth
                  />
                </div>
              </div>
              <div className={dialogStyles.formBlockRow}>
                <div className={dialogStyles.cell}>
                  <label htmlFor="payroll-field">Payroll opportunity</label>
                </div>
                <div className={dialogStyles.cell}>
                  <TextField
                    autoComplete="off"
                    id="payroll-field"
                    type="number"
                    onChange={(ev) => setProjectValue('payroll', Number(ev.target.value))}
                    value={projectState.payroll}
                    fullWidth
                  />
                </div>
              </div>
              <div className={dialogStyles.formBlockRow}>
                <div className={dialogStyles.cell}>
                  <label htmlFor="timeLost-field">Business efficiency</label>
                </div>
                <div className={dialogStyles.cell}>
                  <TextField
                    autoComplete="off"
                    id="timeLost-field"
                    type="number"
                    onChange={(ev) => setProjectValue('timeLost', Number(ev.target.value))}
                    value={projectState.timeLost}
                    fullWidth
                  />
                </div>
              </div>
              <div className={dialogStyles.formBlockRow}>
                <div className={dialogStyles.cell}>
                  <label htmlFor="type-select">Type</label>
                </div>
                <div className={dialogStyles.cell}>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    MenuProps={{ id: 'type-select-menu' }}
                    value={projectState.projectType}
                    label=""
                    onChange={(e) => setProjectValue('projectType', e.target.value as ProjectType)}
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
              <div className={dialogStyles.formBlockRow}>
                <div className={dialogStyles.cell}>
                  <label htmlFor="status-select">Status</label>
                </div>
                <div className={dialogStyles.cell}>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    MenuProps={{ id: 'status-select-menu' }}
                    value={projectState.projectStatus}
                    label=""
                    onChange={(e) => setProjectValue('projectStatus', e.target.value as ProjectStatus)}
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
            </>
          )}
        </div>

        <div className={dialogStyles.formBlock}>
          <h2 className={dialogStyles.subtitle}>
            Key Metrics <span className={dialogStyles.subtitleHighlight}>({projectState.keyMetrics?.length})</span>
          </h2>
          {projectState.keyMetrics?.length ? (
            <>
              {projectState.keyMetrics.map((metric, index) => (
                <KeyMetric
                  key={index}
                  selectMetrics={(draft) => draft.keyMetrics}
                  updateTemplate={updateProject}
                  {...{ metric, index }}
                />
              ))}
            </>
          ) : (
            <div className={dialogStyles.emptyRow}>No key metrics added</div>
          )}
          <div className={dialogStyles.actions}>
            <Button
              variant="contained"
              id="create-project-template-add-key-metric-button"
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                updateProject((draft) => {
                  (draft.keyMetrics ??= []).push({ text: 'New Key Metric' });
                });
              }}
            >
              Add New Metric
            </Button>
          </div>
        </div>
        <div className={dialogStyles.formBlock}>
          <h2 className={dialogStyles.subtitle}>
            Charts <span className={dialogStyles.subtitleHighlight}>({projectState.charts?.length})</span>
          </h2>
          {projectState.charts?.length ? (
            <>
              {projectState.charts.map((chart, index) => (
                <Chart
                  key={index}
                  selectCharts={(draft) => draft.charts}
                  updateTemplate={updateProject}
                  {...{ chart, index }}
                />
              ))}
            </>
          ) : (
            <div className={dialogStyles.emptyRow}>No charts added</div>
          )}
          <div className={dialogStyles.actions}>
            <Button
              variant="contained"
              id="create-project-template-add-chart-button"
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                updateProject((draft) => {
                  (draft.charts ??= []).push({ title: '', body: '', imageUrl: '' });
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
          variant="outlined"
          onClick={() => {
            clear();
            handleClose();
          }}
          id="cancel-button"
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          disabled={disabled || uploadingImages}
          loading={isSaving}
          onClick={handleSubmit}
          id="save-button"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;
