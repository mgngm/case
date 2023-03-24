import { useCallback, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, MenuItem, Select } from '@mui/material';
import { ImprovementStatus } from 'src/components/projects/improvements/table';
import type { Project } from 'src/graphql';
import { ProjectStatus } from 'src/graphql';
import { useUpdateProjectMutation } from 'src/slices/report';

const StatusUpdate = ({ project, className, id }: { project: Project; className?: string; id?: string }) => {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const [status, setStatus] = useState<ProjectStatus>(project.projectStatus!);

  const doUpdateProject = useCallback(
    async (newStatus: ProjectStatus) => {
      try {
        await updateProject({
          project: {
            id: project.id,
            _version: project._version,
            projectStatus: newStatus,
          },
        }).unwrap();

        setStatus(newStatus);
      } catch (err) {
        console.error(err);
      }
    },
    [project._version, project.id, updateProject]
  );

  const handleChange = (ev: SelectChangeEvent) => {
    const newStatus = ev.target.value as ProjectStatus;
    doUpdateProject(newStatus);
  };

  if (!project || !project.projectStatus) {
    return null;
  }

  return (
    <FormControl fullWidth className={className}>
      <Select
        id={id || 'project-status-select'}
        value={status}
        onChange={handleChange}
        disabled={isLoading}
        sx={{
          // TODO: move these to styles/_exports
          // it wouldn't play nice for me :(
          color: 'white',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid #8167ab',
          marginBottom: '0.5rem',
          '.MuiSelect-icon': { fill: 'white' },
        }}
        MenuProps={{ id: `${id || 'project-status-select'}-menu` }}
        variant="outlined"
      >
        <MenuItem value={ProjectStatus.NOT_STARTED}>{ImprovementStatus.NOT_STARTED}</MenuItem>
        <MenuItem value={ProjectStatus.IN_PROGRESS}>{ImprovementStatus.IN_PROGRESS}</MenuItem>
        <MenuItem value={ProjectStatus.ON_HOLD}>{ImprovementStatus.ON_HOLD}</MenuItem>
        <MenuItem value={ProjectStatus.COMPLETED}>{ImprovementStatus.COMPLETED}</MenuItem>
        <MenuItem value={ProjectStatus.ARCHIVED}>{ImprovementStatus.ARCHIVED}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default StatusUpdate;
