import { useCallback, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { produce } from 'immer';
import styles from 'src/components/admin/preview/preview.module.scss';
import ProjectsDialog from 'src/components/admin/preview/projects/project-dialog';
import ProjectUploadDialog from 'src/components/admin/preview/projects/project-dialog/upload';
import type { Project } from 'src/graphql';
import type { UpdateReportWithProjectsFn } from 'src/types/preview';

const Projects = ({
  projects,
  updateReport,
  organisation,
  date,
  parseWarnings,
  inputProjectCsv,
  regenerateTrigger,
}: {
  projects: Project[];
  updateReport: UpdateReportWithProjectsFn;
  organisation: string;
  date: string;
  parseWarnings?: string[];
  inputProjectCsv: string;
  regenerateTrigger: (csvKey: string) => Promise<void>;
}) => {
  const [_projects, setProjects] = useState(projects);
  const [editProject, setEditProject] = useState<Project | undefined>(undefined);
  const [warnings, setWarnings] = useState(parseWarnings);
  const [projectUploadDialogOpen, setProjectUploadDialogOpen] = useState(false);
  useEffect(() => {
    setProjects(projects);
    setWarnings(parseWarnings);
  }, [projects, parseWarnings]);
  const [projectToRemove, setProjectToRemove] = useState<number>();

  const moveProject = useCallback(
    (currentIndex: number, direction = 'up') => {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      // update projects list
      const list = produce(_projects, (draftProjects) => {
        draftProjects.splice(newIndex, 0, ...draftProjects.splice(currentIndex, 1));
      });

      setProjects(list);
      updateReport({ projects: list });
    },
    [_projects, updateReport]
  );

  return (
    <div className={styles.projectsInner} id="report-projects">
      <h3>
        <span>Projects</span>
        <Button
          className={styles.updateProjectBtn}
          onClick={() => setProjectUploadDialogOpen(true)}
          id="update-projects-btn"
          variant="outlined"
        >
          Update projects
        </Button>
      </h3>
      <div>
        <ProjectUploadDialog
          open={projectUploadDialogOpen}
          onClose={() => setProjectUploadDialogOpen(false)}
          inputProjectCsv={inputProjectCsv}
          regenerateTrigger={regenerateTrigger}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {_projects.map((project, idx) => (
            <tr key={idx} id={`project-row-${idx}`}>
              <td>
                <div className={styles.reorderProjectWrap}>
                  <IconButton
                    color="inherit"
                    aria-label="order"
                    className={`${styles.reorderProjectBtn} ${styles.reorderProjectBtnUp}`}
                    title="Move project up"
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) {
                        return;
                      }
                      moveProject(idx, 'up');
                    }}
                    size="small"
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton
                    aria-label="order"
                    className={`${styles.reorderProjectBtn} ${styles.reorderProjectBtnDown}`}
                    title="Move project down"
                    disabled={idx === _projects.length - 1}
                    onClick={() => {
                      if (idx === _projects.length - 1) {
                        return;
                      }
                      moveProject(idx, 'down');
                    }}
                    size="small"
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </div>
              </td>
              <td>{project.projectName}</td>
              <td>
                <IconButton
                  color="inherit"
                  aria-label="edit"
                  className={styles.editProjectBtn}
                  title="Edit this project"
                  onClick={async () => {
                    const _editProject = _projects.find((__p) => __p?.id === project.id);
                    if (_editProject) {
                      setEditProject(_editProject);
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  aria-label="delete"
                  className={styles.deleteProjectBtn}
                  title="Remove this project"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setProjectToRemove(idx);
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(warnings?.length ?? 0) > 0 ? (
        (warnings?.length ?? 0) < 6 ? (
          <Alert severity="info" id="project-mapping-warning" style={{ marginTop: '1rem' }}>
            <span>The following project IDs could not be mapped to a project template:</span>
            <ul>
              {warnings?.map((warning) => {
                const _warning: Record<string, string> = JSON.parse(warning);
                if (_warning.projectId) {
                  return <li key={_warning.projectId}>{_warning.projectId}</li>;
                }
                return null;
              })}
            </ul>
          </Alert>
        ) : (
          <Alert severity="info" id="project-mapping-warning" style={{ marginTop: '1rem' }}>
            {warnings?.length} projects could not be mapped to a project template. Double check the uploaded project
            csv.
          </Alert>
        )
      ) : null}
      {editProject ? (
        <ProjectsDialog
          orgId={organisation}
          reportDate={date}
          open={!!editProject}
          handleClose={() => setEditProject(undefined)}
          project={editProject}
          onSuccess={async (project: Project) => {
            //Fetch preview projects from localstorage, and update it with the new project we've just updated.
            const newProjects = [];
            //Copy over each project into a new array, updating the record with the updated information if it's the desired project.
            for (const _p of _projects) {
              //If it's the project we are updating, insert the new information here
              if (_p.id === project.id) {
                newProjects.push({
                  ..._p,
                  id: project.id,
                  projectDate: project.projectDate,
                  projectName: project.projectName,
                  projectType: project.projectType,
                  projectStatus: project.projectStatus,
                  projectBody: project.projectBody,
                  timeLost: project.timeLost,
                  hxScore: project.hxScore,
                  payroll: project.payroll,
                  employeeCount: project.employeeCount,
                  _version: project._version,
                });
              } else {
                newProjects.push(_p);
              }
            }

            setProjects(newProjects);
            updateReport({ projects: newProjects });
          }}
        />
      ) : null}
      <Dialog
        open={projectToRemove !== undefined}
        onClose={() => setProjectToRemove(undefined)}
        id="confirm-remove-project-dialog"
        aria-labelledby="confirm-remove-project-dialog-title"
      >
        <DialogTitle>
          Remove project &ldquo;{projectToRemove !== undefined && _projects[projectToRemove].projectName}&rdquo;?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove this project?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setProjectToRemove(undefined)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (projectToRemove !== undefined) {
                // remove from list
                // https://github.com/tc39/proposal-change-array-by-copy :eyes:
                const list = produce(_projects, (projects) => {
                  projects.splice(projectToRemove, 1);
                });
                setProjects(list);

                // remove from json
                updateReport({ projects: list });
                setProjectToRemove(undefined);
              }
            }}
            id="confirm-remove-project-button"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Projects;
