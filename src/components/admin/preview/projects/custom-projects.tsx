import { useCallback, useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { produce } from 'immer';
import styles from 'src/components/admin/preview/preview.module.scss';
import ProjectsDialog from 'src/components/admin/preview/projects/project-dialog';
import type { UpdateReportWithProjectsFn } from 'src/types/preview';
import type { CustomProject } from 'src/types/projects';

const CustomProjects = ({
  customProjects,
  updateReport,
  organisation,
  date,
}: {
  customProjects: CustomProject[];
  updateReport: UpdateReportWithProjectsFn;
  organisation: string;
  date: string;
}) => {
  const [projects, setProjects] = useState(customProjects ?? []);
  const [createCustomProjectOpen, setCreateCustomProjectOpen] = useState(false);
  const [editCustomProjectOpen, setEditCustomProjectOpen] = useState(false);
  const [editProject, setEditProject] = useState<{ project: CustomProject; index: number } | undefined>(undefined);
  const [projectToRemove, setProjectToRemove] = useState<number>();

  useEffect(() => {
    setProjects(customProjects);
  }, [customProjects]);

  const moveCustomProject = useCallback(
    (currentIndex: number, direction = 'up') => {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      // update projects list
      const list = produce(projects, (draftProjects) => {
        draftProjects.splice(newIndex, 0, ...draftProjects.splice(currentIndex, 1));
      });

      setProjects(list);

      // update report
      updateReport({ customProjects: list });
    },
    [projects, updateReport]
  );

  return (
    <>
      <div className={styles.projectsInner} id="report-custom-projects">
        <h3>
          <span>Custom projects</span>
          <IconButton
            color="inherit"
            className={styles.createProjectBtn}
            title="Create a new custom project"
            onClick={(ev) => {
              ev.preventDefault();
              setCreateCustomProjectOpen(true);
            }}
            id="add-custom-project"
          >
            <AddCircleIcon />
          </IconButton>
        </h3>
        <table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Name</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((project, idx) => (
              <tr key={idx} id={`custom-project-row-${idx}`}>
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
                        moveCustomProject(idx, 'up');
                      }}
                      size="small"
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      aria-label="order"
                      className={`${styles.reorderProjectBtn} ${styles.reorderProjectBtnDown}`}
                      title="Move project down"
                      disabled={idx === projects.length - 1}
                      onClick={() => {
                        if (idx === projects.length - 1) {
                          return;
                        }
                        moveCustomProject(idx, 'down');
                      }}
                      size="small"
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  </div>
                </td>
                <td>{project.title}</td>
                <td>
                  <IconButton
                    color="inherit"
                    aria-label="edit"
                    className={styles.editProjectBtn}
                    title="Edit this custom project"
                    onClick={() => {
                      setEditProject({ project, index: idx });
                      setEditCustomProjectOpen(true);
                    }}
                    id={`custom-project-row-${idx}-edit-button`}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    aria-label="delete"
                    className={styles.deleteProjectBtn}
                    title="Remove this custom project"
                    onClick={(ev) => {
                      ev.preventDefault();

                      setProjectToRemove(idx);
                    }}
                    id={`custom-project-row-${idx}-delete-button`}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProjectsDialog
        orgId={organisation}
        reportDate={date}
        open={createCustomProjectOpen}
        handleClose={() => setCreateCustomProjectOpen(false)}
        onSuccess={(project) => {
          // add to list
          const _projects = [...projects, project];
          setProjects(_projects);

          // add to json
          updateReport({ customProjects: _projects });
        }}
      />
      <ProjectsDialog
        orgId={organisation}
        reportDate={date}
        open={editCustomProjectOpen}
        handleClose={() => setEditCustomProjectOpen(false)}
        customProject={editProject}
        onSuccess={(project, index) => {
          if (index !== undefined) {
            const _projects = produce(projects, (draftProjects) => {
              draftProjects.splice(index, 1, project);
            });
            setProjects(_projects);
            updateReport({ customProjects: _projects });
          }
        }}
      />
      <Dialog
        open={projectToRemove !== undefined}
        onClose={() => setProjectToRemove(undefined)}
        id="confirm-remove-custom-project-dialog"
        aria-labelledby="confirm-remove-custom-project-dialog-title"
      >
        <DialogTitle>
          Remove custom project &ldquo;{projectToRemove !== undefined && projects[projectToRemove].title}&rdquo;?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove this custom project?</DialogContentText>
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
                const list = produce(projects, (projects) => {
                  projects.splice(projectToRemove, 1);
                });
                setProjects(list);

                // remove from json
                updateReport({ customProjects: list });
                setProjectToRemove(undefined);
              }
            }}
            id="confirm-remove-custom-project-button"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomProjects;
