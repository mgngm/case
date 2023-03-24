import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { FormControl, MenuItem, Select, IconButton, useTheme, TableRow, TableCell, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import propTypes from 'prop-types';
import { MoonLoader } from 'react-spinners';
import contextStyles from 'src/components/admin/context.module.scss';
import {
  REPORT_ACCESS_LEVELS,
  REPORT_ACCESS_LEVELS_INFO,
  REPORT_ACCESS_LEVELS_ORDERED_KEYS,
  PARTNER_LEVEL_REPORT_ACCESS_LEVELS_ORDERED_KEYS,
} from 'src/constants/admin';
import { ADMIN_PREVIEW_ROUTE } from 'src/constants/routes';
import { AccessLevel, ReportStatus } from 'src/graphql';
import type { Report } from 'src/graphql';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import { resetPreview } from 'src/slices/preview';
import { useUpdateReportMutation } from 'src/slices/report';
import { selectUserAccessLevel } from 'src/slices/users';

const ReportRow = ({
  report,
  setDeleteReport,
  disableDeleteReport,
}: {
  report: Report;
  setDeleteReport: Dispatch<SetStateAction<Report | null>>;
  disableDeleteReport: boolean;
}) => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [accessLevel, setAccessLevel] = useState(report.accessLevel);
  const [updateReport, updateReportRes] = useUpdateReportMutation();

  const contextInfo = useContextInfo();

  const userAccessLevel = useAppSelector(selectUserAccessLevel);

  const availableAccessLevels =
    userAccessLevel === AccessLevel.GLOBAL
      ? REPORT_ACCESS_LEVELS_ORDERED_KEYS
      : PARTNER_LEVEL_REPORT_ACCESS_LEVELS_ORDERED_KEYS;

  const handleEditReport = async ({ reportId }: { reportId: string }) => {
    if (!reportId) {
      return;
    }
    try {
      // clear preview state
      dispatch(resetPreview());
      // store the report in localStorage for the iframe
      router.push(`${ADMIN_PREVIEW_ROUTE}?reportId=${reportId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAccessLevel = async (_accessLevel: AccessLevel) => {
    //Create a new object that matches the ModelInput for reports.
    const newReport = { id: report.id, _version: report._version, accessLevel: _accessLevel };

    try {
      await updateReport({ report: newReport, context: contextInfo.adminContext.prettyId as string });
      setAccessLevel(_accessLevel);
    } catch (e) {
      console.error('There was an error updating the access level for your report', e);
    }
  };

  return (
    <TableRow id={`report-row-${report.id}`}>
      <TableCell>{report.reportName}</TableCell>
      <TableCell align="center">{report.reportDate}</TableCell>
      <TableCell align="center">
        {report.reportStatus === ReportStatus.FOR_DELETION ? (
          <Tooltip title={'This report is marked for deletion, it will disappear soon...'}>
            <span>
              <IconButton size="small" color="inherit" disabled={true} id={`deleting-report-icon-${report.id}`}>
                <HourglassTopIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <>
            <IconButton
              size="small"
              color="inherit"
              id={`edit-report-button-${report.id}`}
              onClick={() => handleEditReport({ reportId: report.id })}
            >
              <EditIcon />
            </IconButton>

            <Tooltip
              title={
                disableDeleteReport
                  ? 'You cannot delete the only report you have!'
                  : 'Delete this report and all associated project and DUs. This cannot be undone!'
              }
            >
              <span>
                <IconButton
                  size="small"
                  color="inherit"
                  disabled={disableDeleteReport}
                  id={`delete-report-button-${report.id}`}
                  onClick={() => setDeleteReport(report)}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      </TableCell>
      {userAccessLevel !== AccessLevel.ORGANISATION ? (
        <TableCell>
          {updateReportRes.isLoading || report.reportStatus === ReportStatus.FOR_DELETION ? (
            <div className={contextStyles.loading}>
              <MoonLoader color={theme.palette.primary.main} size={24} />
            </div>
          ) : (
            <FormControl fullWidth className={contextStyles.accessLevelForm}>
              <Select
                labelId="access-level-select-label"
                id="access-level-select"
                MenuProps={{ id: 'access-level-select-menu' }}
                value={accessLevel}
                onChange={(e) => handleUpdateAccessLevel(e.target.value as AccessLevel)}
                className={contextStyles.orgSelect}
                sx={{
                  color: 'black',
                  background: 'white',
                  ':hover': { background: 'white', color: 'black' },
                }}
              >
                {availableAccessLevels.map((_accessLevel) => (
                  <MenuItem
                    key={_accessLevel}
                    value={_accessLevel}
                    id={`access-level-list-item-${_accessLevel}`}
                    className={contextStyles.contextItem}
                  >
                    <span className={contextStyles.partnerName}>{REPORT_ACCESS_LEVELS_INFO[_accessLevel]}</span>
                    <span>
                      {REPORT_ACCESS_LEVELS[_accessLevel]} {_accessLevel === AccessLevel.PARTNER && `(Partner only)`}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </TableCell>
      ) : null}
    </TableRow>
  );
};

ReportRow.propTypes = {
  user: propTypes.object,
  disabled: propTypes.bool,
};

export default ReportRow;
