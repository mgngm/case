import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableCell, TableRow } from '@mui/material';
import type { ProjectTemplate } from 'src/types/projects';

const ProjectTemplateRow = ({
  projectTemplate,
  handleDelete,
  handleEdit,
}: {
  projectTemplate: ProjectTemplate;
  handleEdit: () => void;
  handleDelete: () => void;
}) => (
  <TableRow id={`project-template-row-${projectTemplate.id}`}>
    <TableCell>{projectTemplate.name}</TableCell>
    <TableCell>{projectTemplate.templateId}</TableCell>
    <TableCell align="center">
      <IconButton
        color="inherit"
        size="small"
        id={`edit-project-template-button-${projectTemplate.id}`}
        onClick={handleEdit}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        color="inherit"
        size="small"
        id={`delete-project-template-button-${projectTemplate.id}`}
        onClick={handleDelete}
      >
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

export default ProjectTemplateRow;
