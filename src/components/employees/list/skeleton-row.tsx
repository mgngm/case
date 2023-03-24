import { Skeleton, TableCell, TableRow } from '@mui/material';
import styles from './list.module.scss';

const EmployeeSkeletonRow = () => {
  return (
    <TableRow>
      <TableCell align="center" padding="checkbox" className={styles.checkboxColumn}>
        <Skeleton
          variant="rectangular"
          className={styles.skeleton}
          sx={{ height: 24, width: 24, m: '9px', borderRadius: (theme) => theme.shape.borderRadius + 'px' }}
        />
      </TableCell>
      <TableCell align="center" padding="checkbox" className={styles.iconButtonColumn}>
        <Skeleton variant="circular" className={styles.skeleton} sx={{ height: 24, width: 24, m: '9px' }} />
      </TableCell>
      <TableCell align="left" className={styles.nameColumn}>
        <Skeleton className={styles.skeleton}>Placeholder Name</Skeleton>
      </TableCell>
      <TableCell align="left" className={styles.countryColumn}>
        <Skeleton className={styles.skeleton}>Country</Skeleton>
      </TableCell>
      <TableCell align="left" className={styles.officeColumn}>
        <Skeleton className={styles.skeleton}>Placeholder Office</Skeleton>
      </TableCell>
      <TableCell align="left" className={styles.projectsColumn}>
        <Skeleton className={styles.skeleton}>n/a</Skeleton>
      </TableCell>
      <TableCell align="right" className={styles.hxScoreColumn}>
        <Skeleton className={styles.skeleton} sx={{ ml: 'auto' }}>
          8.0
        </Skeleton>
      </TableCell>
      <TableCell align="left" className={styles.hxBandingColumn}>
        <Skeleton className={styles.skeleton}>Satisfied</Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeSkeletonRow;
