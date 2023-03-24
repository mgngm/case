import { TableCell, TableRow } from '@mui/material';
import type { CarbonEmissionChartDatum } from 'src/components/page-sections/carbon-emissions';

const CarbonEmissionRow = ({ datum }: { datum: CarbonEmissionChartDatum }) => {
  return (
    <TableRow id={`carbon-emission-row`}>
      <TableCell align="left">{datum.locationName}</TableCell>
      <TableCell align="center">{datum.employeeCount}</TableCell>
      <TableCell align="right">{datum.co2TotalSaved}</TableCell>
      <TableCell align="right">{datum.co2TotalPotential}</TableCell>
      <TableCell align="right">{datum.co2AverageSaved}</TableCell>
      <TableCell align="right">{datum.co2AveragePotential}</TableCell>
    </TableRow>
  );
};

export default CarbonEmissionRow;
