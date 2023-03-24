import { useMemo } from 'react';
import { VisibilityOutlined } from '@mui/icons-material';
import {
  Icon,
  iconButtonClasses,
  Paper,
  selectClasses,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { ButtonRow, TableEmptyBody } from 'src/components/shared/table';
import { IMPROVEMENT_TYPE } from 'src/constants/display';
import type { DU, Project } from 'src/graphql';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { nonNullable, sortByKey } from 'src/logic/libs/helpers';
import type { Satisfies } from 'src/types/util';
import styles from './improvements.module.scss';

type ImprovementsProps = {
  employee: DU;
  onImprovement?: (id: string) => void;
};

type SortableKeys = Satisfies<'projectName' | 'projectType', keyof Project>;

const Improvements = ({ employee, onImprovement }: ImprovementsProps) => {
  const { column, direction, getCellProps, getSortLabelProps } = useSort<SortableKeys>('projectName');
  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: employee.projects?.items.length ?? 0 });
  const displayProjects = useMemo(
    () =>
      employee.projects?.items
        .map((item) => item?.project)
        .filter(nonNullable)
        .sort(sortByKey(column, direction))
        .slice(...sliceArgs) ?? [],
    [column, direction, employee.projects?.items, sliceArgs]
  );
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Featured in Improvement Project</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell id="improvement-name-heading" {...getCellProps('projectName')}>
                <TableSortLabel {...getSortLabelProps('projectName')}>Improvement Name</TableSortLabel>
              </TableCell>
              <TableCell id="improvement-type-heading" {...getCellProps('projectType')}>
                <TableSortLabel {...getSortLabelProps('projectType')}>Improvement Type</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          {displayProjects.length ? (
            <TableBody>
              {displayProjects.map((project) => (
                <TableRow
                  key={project.id}
                  id={'improvement-row-' + project.projectId}
                  {...(onImprovement && {
                    component: ButtonRow,
                    onClick: () => onImprovement(project.id),
                    hover: true,
                  })}
                >
                  <TableCell padding="checkbox">
                    <Icon color="inherit" sx={{ verticalAlign: 'middle', opacity: 0.6, mx: 1 }}>
                      <VisibilityOutlined />
                    </Icon>
                  </TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.projectType && IMPROVEMENT_TYPE[project.projectType]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableEmptyBody>No improvements</TableEmptyBody>
          )}
        </Table>
      </TableContainer>
      <div className={styles.paginationContainer}>
        <TablePagination
          component="div"
          sx={{
            color: 'white',
            ['.' + selectClasses.icon]: {
              color: '#8167AB',
            },
            ['.' + iconButtonClasses.root]: {
              color: '#8167AB',
              ':disabled': {
                opacity: 0.4,
              },
            },
          }}
          {...getPaginationProps('employee-improvements-pagination')}
        />
      </div>
    </div>
  );
};

export default Improvements;
