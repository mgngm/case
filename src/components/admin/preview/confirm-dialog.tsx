import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import contextStyles from 'src/components/admin/context.module.scss';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import ActualInput from 'src/components/shared/input';
import {
  REPORT_ACCESS_LEVELS_ORDERED_KEYS,
  REPORT_ACCESS_LEVELS,
  REPORT_ACCESS_LEVELS_INFO,
  PARTNER_LEVEL_REPORT_ACCESS_LEVELS_ORDERED_KEYS,
} from 'src/constants/admin';
import { REPORT_PUBLISH_QUEUE } from 'src/constants/api';
import { SQS_MESSAGE_API_ROUTE } from 'src/constants/routes';
import { REPORT_LIST_TAG, REPORT_TAG } from 'src/constants/slices';
import type { UpdateProjectMutationVariables } from 'src/graphql';
import { AccessLevel } from 'src/graphql';
import { updateProject, updateReport } from 'src/graphql/mutations';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useReport from 'src/hooks/use-report';
import { graphQL } from 'src/logic/client/graphql';
import { baseApi, getAuthHeader } from 'src/slices/api';
import { useGetOrganisationQuery } from 'src/slices/organisations';
import {
  selectCustomProjects,
  selectInsights,
  selectPreviewProjects,
  selectPreviewReportData,
  selectPreviewReportDate,
  selectPreviewReportName,
} from 'src/slices/preview';
import { selectNewReport } from 'src/slices/report';
import { selectUserAccessLevel } from 'src/slices/users';
import styles from './confirm-dialog.module.scss';

type ConfirmSaveDialogProps = {
  open: boolean;
  handleClose: (redirect?: boolean) => void;
  reportId: string;
  newReport: boolean;
  orgId: string;
  prettyOrgId: string;
  parseId: string;
};

const ConfirmSaveDialog = ({
  open,
  handleClose,
  reportId,
  newReport,
  orgId,
  prettyOrgId,
  parseId,
}: ConfirmSaveDialogProps) => {
  const dispatch = useAppDispatch();
  const userAccessLevel = useAppSelector(selectUserAccessLevel);

  const { queryReport: report } = useReport(reportId); //we want to get the preview report we're currently looking at to check if we've updated any of the meta.

  const reportName = useAppSelector(selectPreviewReportName);
  const reportData = useAppSelector(selectPreviewReportData);
  const reportDate = useAppSelector(selectPreviewReportDate);

  const [saving, setSaving] = useState(false);
  const [selectReportAfterPublish, setSelectReportAfterPublish] = useState(false);

  const [accessLevel, setAccessLevel] = useState<AccessLevel>(report?.data?.accessLevel ?? userAccessLevel);

  useEffect(() => {
    report?.data?.accessLevel && setAccessLevel(report?.data?.accessLevel);
  }, [report?.data?.accessLevel]);

  const previewProjects = useAppSelector(selectPreviewProjects);
  const previewProjectIds = previewProjects?.map(({ id }: { id: string }) => id) ?? [];
  const selectedInsights = useAppSelector(selectInsights);
  const customProjects = useAppSelector(selectCustomProjects);

  //Select org info for org defined in report.
  const { orgData } = useGetOrganisationQuery(
    { organisationId: orgId },
    { selectFromResult: ({ data }) => ({ orgData: data?.data }) }
  );

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm report publish</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {newReport
            ? `Are you sure you want to publish applied changes for this new report to ${
                orgData?.organisationName ?? prettyOrgId
              } for ${reportDate}?`
            : `Are you sure you want to overwrite this ${
                orgData?.organisationName ?? prettyOrgId
              } report for ${reportDate} with applied changes?`}
        </DialogContentText>
        {newReport && userAccessLevel !== AccessLevel.ORGANISATION ? (
          <DialogContentText>
            <div className={styles.accessLevelWrapper}>
              <span>Access Level:</span>
              <FormControl fullWidth className={contextStyles.accessLevelForm}>
                <Select
                  labelId="access-level-select-label"
                  id="access-level-select"
                  MenuProps={{ id: 'access-level-select-menu' }}
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
                  className={contextStyles.aeSelect}
                  sx={{
                    color: 'black',
                    background: 'white',
                    ':hover': { background: 'white', color: 'black' },
                  }}
                >
                  {(userAccessLevel === AccessLevel.GLOBAL
                    ? REPORT_ACCESS_LEVELS_ORDERED_KEYS
                    : PARTNER_LEVEL_REPORT_ACCESS_LEVELS_ORDERED_KEYS
                  ).map((_accessLevel) => (
                    <MenuItem key={_accessLevel} value={_accessLevel} className={contextStyles.selectItem}>
                      <span className={contextStyles.miniTitle}>{REPORT_ACCESS_LEVELS_INFO[_accessLevel]}</span>
                      <span>
                        {REPORT_ACCESS_LEVELS[_accessLevel]}{' '}
                        {_accessLevel === AccessLevel.PARTNER && `(${orgData?.partner?.partnerName ?? 'Partner'} only)`}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </DialogContentText>
        ) : null}
      </DialogContent>
      <DialogActions>
        <div className={styles.selectReportAfterPublish}>
          <span id="alert-dialog-select-after-publish">Select this report after publishing?</span>
          <ActualInput
            className={styles.selectReportAfterPublishCheckbox}
            type="checkbox"
            id="alert-dialog-select-after-publish-checkbox"
            checked={selectReportAfterPublish}
            onChange={(e) => setSelectReportAfterPublish(e.target.checked)}
          />
        </div>
        <Button variant="outlined" onClick={() => handleClose(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={saving}
          loadingIndicator={<ButtonLoadingIndicator />}
          id="publish-button"
          variant="contained"
          onClick={async () => {
            setSaving(true);

            if (!reportData) {
              return;
            }

            //First off update report name / date in the db if you've changed either.
            if (report?.data?.id && report?.data?._version) {
              graphQL({
                query: updateReport,
                variables: {
                  input: {
                    id: report?.data?.id,
                    _version: report?.data?._version,
                    reportName: reportName,
                    reportDate: reportDate,
                    reportData: JSON.stringify(reportData),
                    projectIds: previewProjectIds,
                    customProjects: JSON.stringify(customProjects),
                    insightIds: selectedInsights,
                  },
                },
              });
            }

            //Then trigger lambda to publish report.

            try {
              const messageBody = {
                reportId, //get from url
                //from report, not admin context
                orgId: prettyOrgId, //needed.
                //set on form
                accessLevel, //neded
                //can use preview state
                projects: previewProjectIds,
                insights: selectedInsights,
                parseId,
              };

              await fetch(SQS_MESSAGE_API_ROUTE, {
                method: 'POST',
                body: JSON.stringify({
                  queue: REPORT_PUBLISH_QUEUE,
                  messageBody,
                }),
                headers: { 'content-type': 'application/json', authorization: await getAuthHeader() },
              });

              //If the response is OK we need to do two things to each project we have now (this fn is gross lets break it up PLEASE)
              //Loop through each previewProject we have available
              //For each one, we want to update them in ddb with what we have from localstorage
              for (const _pProj of previewProjects) {
                //Craft a new project item using as much data as we can
                const inputVars: UpdateProjectMutationVariables['input'] = {
                  id: _pProj.id,
                  employeeCount: _pProj.employeeCount,
                  hxScore: _pProj.hxScore,
                  payroll: _pProj.payroll,
                  projectBody: _pProj.projectBody,
                  projectDate: _pProj.projectDate,
                  projectName: _pProj.projectName,
                  projectStatus: _pProj.projectStatus,
                  projectType: _pProj.projectType,
                  timeLost: _pProj.timeLost,
                  _version: _pProj._version,
                  reportProjectsId: reportId,
                };

                try {
                  await graphQL({
                    query: updateProject,
                    variables: {
                      input: inputVars,
                    },
                  });
                } catch (e) {
                  console.error(`There was an error editing project ${inputVars.projectName}`, e);
                }
              }

              if (selectReportAfterPublish) {
                //If we are publishing a new report, and awant to select it we need to craft the report name to select it, Otherwise use what we got
                dispatch(selectNewReport({ reportId: reportId, context: orgId }));
              }

              //Refresh the list so you can see your new report. (set it on a timeout so the list definitely catches this report.)
              setTimeout(
                () => dispatch(baseApi.util.invalidateTags([REPORT_LIST_TAG, { id: reportId, type: REPORT_TAG }])),
                5000 //arbitrary
              );
              handleClose();
            } catch (err) {
              console.error(err);
            } finally {
              setSaving(false);
            }
          }}
          autoFocus
        >
          Publish
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmSaveDialog;
