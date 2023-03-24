import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableCell, TableRow } from '@mui/material';
import type { Insight } from 'src/slices/insights';

type InsightRowProps = {
  insight: Insight;
  edit: () => void;
  delete: () => void;
};

const InsightRow = ({ insight, edit, delete: del }: InsightRowProps) => {
  return (
    <TableRow>
      <TableCell>{insight.name}</TableCell>
      <TableCell align="center">{insight.insightDate}</TableCell>
      <TableCell padding="checkbox">
        <IconButton color="inherit" size="small" onClick={edit}>
          <EditIcon />
        </IconButton>
        <IconButton color="inherit" size="small" onClick={del}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default InsightRow;
