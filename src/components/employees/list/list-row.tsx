import { Visibility, VisibilityOutlined } from '@mui/icons-material';
import { Icon, Chip, TableCell, TableRow } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ButtonRow } from 'src/components/shared/table';
import type { DU } from 'src/graphql';
import { LocationType } from 'src/graphql';
import { constructValueDisplayString } from 'src/logic/libs/helpers';
import styles from './list.module.scss';

type EmployeeRowProps = {
  employee: DU;
  handleCheck: ({ checked, id }: { checked: boolean; id: string }) => void;
  selected: boolean;
  detailsOpen: boolean;
  onDetails: () => void;
  onImprovement: (id: string) => void;
};

export const banding = (hxScore: number) => {
  switch (true) {
    case hxScore < 5:
      return 'Suffering';
    case hxScore < 8:
      return 'Frustrated';
    default:
      return 'Satisfied';
  }
};

const EmployeeRow = ({ employee, handleCheck, selected, detailsOpen, onDetails, onImprovement }: EmployeeRowProps) => {
  return (
    <TableRow id={`employee-row-${employee.id}`} component={ButtonRow} hover selected={detailsOpen} onClick={onDetails}>
      <TableCell
        align="center"
        padding="checkbox"
        id={`employee-row-id-${employee.id}`}
        className={styles.checkboxColumn}
      >
        <Checkbox
          disabled={false}
          checked={selected}
          size="small"
          // prevent ripple
          onMouseDown={(e) => e.stopPropagation()}
          // prevent details opening
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleCheck({ checked: e.target.checked, id: employee.id })}
        />
      </TableCell>
      <TableCell align="center" padding="checkbox" className={styles.iconButtonColumn}>
        <Icon sx={{ verticalAlign: 'middle' }}>
          {detailsOpen ? (
            <Visibility sx={{ opacity: 0.8, fill: '#7d68a7' }} />
          ) : (
            <VisibilityOutlined sx={{ opacity: 0.6, fill: '#7d68a7' }} />
          )}
        </Icon>
      </TableCell>
      <TableCell align="left" id={`employee-row-name-${employee.id}`} className={styles.nameColumn}>
        {employee.name}
      </TableCell>
      <TableCell align="left" id={`employee-row-country-${employee.id}`} className={styles.countryColumn}>
        {employee.country}
      </TableCell>
      <TableCell align="left" id={`employee-row-office-${employee.id}`} className={styles.officeColumn}>
        {employee.office || (employee.locationType === LocationType.REMOTE ? 'Remote' : 'Unknown')}
      </TableCell>
      <TableCell align="left" id={`employee-row-projects-${employee.id}`} className={styles.projectsColumn}>
        {(employee.projects?.items.length ?? 0) === 0 ? (
          'n/a'
        ) : (
          <div className={styles.chipContainer}>
            {employee.projects?.items?.map(
              (p) =>
                p && (
                  <Chip
                    // prevent ripple
                    onMouseDown={(e) => e.stopPropagation()}
                    // prevent details opening
                    onClick={(e) => {
                      e.stopPropagation();
                      onImprovement(p.project.id);
                    }}
                    id={`${employee.id}-project-${p.project.projectId}-${p.project.id}`}
                    key={p.project.id}
                    label={p.project?.projectName}
                  />
                )
            )}
          </div>
        )}
      </TableCell>
      <TableCell align="right" id={`employee-row-hxscore-${employee.id}`} className={styles.hxScoreColumn}>
        {constructValueDisplayString(employee.hxScore ?? 0)}
      </TableCell>
      <TableCell align="left" id={`employee-row-hxbanding-${employee.id}`} className={styles.hxBandingColumn}>
        {banding(employee.hxScore ?? 0)}
      </TableCell>
    </TableRow>
  );
};

export default EmployeeRow;
