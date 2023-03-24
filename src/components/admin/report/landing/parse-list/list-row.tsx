import type { Dispatch, SetStateAction } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import { IconButton, TableRow, TableCell, Tooltip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { ADMIN_REPORTS_ROUTE } from 'src/constants/routes';
import type { Parse, ReportStatus } from 'src/graphql';

const ParseRow = ({
  parse,
  reportMeta,
  setParseForWarningDialog,
}: {
  parse: Parse;
  reportMeta: Record<string, Record<string, string | ReportStatus>>;
  setParseForWarningDialog: Dispatch<SetStateAction<Parse | null>>;
}) => {
  const router = useRouter();

  if (!parse.id) {
    return null;
  }

  const dateFormatted = format(parseISO(parse.startDateTime ?? ''), 'dd-MM-yyyy - hh:mm:ss');

  return (
    <TableRow id={`parse-row-${parse.id}`}>
      <TableCell>{parse.id}</TableCell>
      <TableCell align="center">{dateFormatted}</TableCell>
      <TableCell>{reportMeta[parse.parseReportId as string].name || parse.parseReportId}</TableCell>
      <TableCell>{reportMeta[parse.parseReportId as string].status || 'N/A'}</TableCell>
      <TableCell align="center">{parse.status}</TableCell>
      <TableCell align="center">
        <Tooltip
          title={
            'View the result of this parse. If the parse was successful or finishes while you are viewing it, you will be redirected to the report preview page.'
          }
        >
          <span>
            <IconButton
              size="small"
              color="inherit"
              id={`view-parse-button-${parse.id}`}
              onClick={() => router.push(`${ADMIN_REPORTS_ROUTE}?parseId=${parse.id}`)}
            >
              <VisibilityIcon />
            </IconButton>
          </span>
        </Tooltip>
        {parse.warnings && parse.warnings.length > 0 ? (
          <Tooltip title={'This parse produced warnings. View these directly here.'}>
            <span>
              <IconButton
                size="small"
                color="inherit"
                id={`view-parse-button-${parse.id}`}
                onClick={() => setParseForWarningDialog(parse)}
              >
                <WarningIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default ParseRow;
