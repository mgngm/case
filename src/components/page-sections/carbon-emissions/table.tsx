import { useMemo } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import type { CarbonEmissionChartDatum } from 'src/components/page-sections/carbon-emissions';
import { TableEmptyBody } from 'src/components/shared/table';
import useSort from 'src/hooks/use-sort';
import { sortByKey } from 'src/logic/libs/helpers';
import styles from './carbon-emissions.module.scss';
import ListRow from './table-row';

const CarbonEmissionsTable = ({ data }: { data: CarbonEmissionChartDatum[] }) => {
  const {
    column: sortCol,
    direction: sortDir,
    getCellProps,
    getSortLabelProps,
  } = useSort<
    'locationName' | 'employeeCount' | 'co2TotalSaved' | 'co2TotalPotential' | 'co2AverageSaved' | 'co2AveragePotential'
  >('locationName', 'asc');

  const renderList = useMemo(() => data.slice().sort(sortByKey(sortCol, sortDir)), [sortCol, sortDir, data]);

  return (
    <div className={styles.carbonTable}>
      <TableContainer component={Paper}>
        <Table id="report-list-table">
          <TableHead>
            <TableRow>
              <TableCell align="left" id="location-name-heading" {...getCellProps('locationName')}>
                <TableSortLabel {...getSortLabelProps('locationName')}>Office</TableSortLabel>
              </TableCell>
              <TableCell align="center" id="employee-count-heading" {...getCellProps('employeeCount')}>
                <TableSortLabel {...getSortLabelProps('employeeCount')}>Employee Count</TableSortLabel>
              </TableCell>
              <TableCell align="right" id="co2-total-saved-heading" {...getCellProps('co2TotalSaved')}>
                <TableSortLabel {...getSortLabelProps('co2TotalSaved')}>CO2 Saved (KG Tonnes)</TableSortLabel>
              </TableCell>
              <TableCell align="right" id="co2-total-potential-heading" {...getCellProps('co2TotalPotential')}>
                <TableSortLabel {...getSortLabelProps('co2TotalPotential')}>
                  Total Potential CO2 emissions (KG Tonnes)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" id="co2-average-saved-heading" {...getCellProps('co2AverageSaved')}>
                <TableSortLabel {...getSortLabelProps('co2AverageSaved')}>
                  Average CO2 Saved Per Employee (KG Tonnes)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" id="co2-average-potential-heading" {...getCellProps('co2AveragePotential')}>
                <TableSortLabel {...getSortLabelProps('co2AveragePotential')}>
                  Total Potential CO2 emissions per employee (KG Tonnes)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          {renderList.length ? (
            <TableBody>
              {renderList.map((_datum) => (
                <ListRow key={_datum.locationName} datum={_datum} />
              ))}
            </TableBody>
          ) : (
            <TableEmptyBody id="reports-list-empty">No reports found for this context</TableEmptyBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

export default CarbonEmissionsTable;
