import type { SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Tab, useTheme, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { MoonLoader } from 'react-spinners';
import CreateReport from 'src/components/admin/report/landing/create';
import ParseProgressDialog from 'src/components/admin/report/landing/parse-progress-dialog';
import PersonaSettingsDialog from 'src/components/admin/report/landing/persona-settings/current-settings';
import UploadSettingsDialog from 'src/components/admin/report/landing/persona-settings/upload';
import tabStyles from 'src/components/shared/tab/index.module.scss';
import { a11yProps, TabPanel } from 'src/components/shared/tabs';
import { ADMIN_PREVIEW_ROUTE } from 'src/constants/routes';
import { ParseStatus } from 'src/graphql';
import { useAppDispatch } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import { validatedPoll } from 'src/logic/client/poll';
import { reportParsePollFn, reportParseStatusValidation } from 'src/logic/client/report';
import { useLazyGetParseQuery } from 'src/slices/report';
import styles from './landing.module.scss';
import ParseList from './parse-list';
import ReportList from './report-list';

const ReportLandingPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const [tabVal, setTabVal] = useState(0);
  const contextInfo = useContextInfo();

  const dispatch = useAppDispatch();

  const [uploadSettingsOpen, setUploadSettingsOpen] = useState(false);
  const [viewSettingsOpen, setViewSettingsOpen] = useState(false);
  const [reportCreateOpen, setReportCreateOpen] = useState(false);

  const parseId = router.query.parseId
    ? Array.isArray(router.query.parseId)
      ? router.query.parseId[0]
      : router.query.parseId
    : undefined;
  const [parseStatus, setParseStatus] = useState<ParseStatus | null>(null);
  const [getParse] = useLazyGetParseQuery();

  //Once we have a parseId, start polling for it. First for the fact that it's uploading - second we'll poll for when it's completed.
  useEffect(() => {
    if (parseId) {
      try {
        setParseStatus(ParseStatus.UPLOADING);
        validatedPoll({
          debug: !!router.query.verbose,
          fn: (debug) =>
            reportParsePollFn({
              trigger: getParse,
              parseId,
              debug,
            }),
          validate: (parse, debug) =>
            reportParseStatusValidation({
              parse,
              desiredStatus: [ParseStatus.UPLOADING, ParseStatus.IN_PROGRESS, ParseStatus.SUCCESS],
              debug,
            }),
          interval: 5000,
          status: ParseStatus.UPLOADING,
          maxAttempts: 60,
        })
          //pollception - first poll checks to see we can actually hook into the parse, so it just validates by finding a parse with any status
          //The second poll will now scan the same parseId looking for a parseStatus of SUCCESS so we can move the user to the preview page.
          .then(() =>
            validatedPoll({
              fn: (debug) =>
                reportParsePollFn({
                  trigger: getParse,
                  parseId,
                  debug,
                }),
              validate: (parse, debug) =>
                reportParseStatusValidation({ parse, desiredStatus: ParseStatus.SUCCESS, debug }),
              interval: 5000,
              status: ParseStatus.SUCCESS,
              maxAttempts: 60,
            })
          )
          //Once we know the parse is finished, extract the completed report ID and navigate to preview.
          .then((reportParse) => {
            const id = reportParse.parseReportId;
            if (id) {
              setParseStatus(ParseStatus.SUCCESS);
              router.push(`${ADMIN_PREVIEW_ROUTE}?reportId=${id}&newReport=${router.query.newReport ?? false}`);
            } else {
              setParseStatus(ParseStatus.ERROR);
              console.error('Something went wrong, no report id available on the parse.');
            }
          })
          //If anything dies for whatever reason, set the parse state as an error and baaaaail.
          .catch((err) => {
            console.error(err);
            setParseStatus(ParseStatus.ERROR);
          });
      } catch (e) {
        console.error('Polling failed!', e);
      }
    }
  }, [getParse, dispatch, router, parseId]);

  let personaSettingsContent = (
    <div id="persona-settings-validity" className={styles.personaSettingsInfo}>
      <div className={styles.personaIcon}>
        {contextInfo?.adminContext?.meta?.personaSettings ? <CheckCircleOutlineIcon /> : <CancelIcon />}
      </div>
      {contextInfo?.adminContext?.meta?.personaSettings ? (
        <span>Valid Persona Settings Uploaded</span>
      ) : (
        <span>No Persona Settings Currently Uploaded</span>
      )}
    </div>
  );

  if (contextInfo.loading) {
    personaSettingsContent = (
      <div className={styles.personaLoading}>
        <MoonLoader color={theme.palette.primary.main} size={24} />
      </div>
    );
  }

  return (
    <div className={styles.landingWrapper}>
      <div className={styles.personaSettings}>
        <ParseProgressDialog
          parseId={parseId}
          parseStatus={parseStatus ?? undefined}
          close={() => setParseStatus(null)}
        />
        <h2>Persona Settings</h2>
        {personaSettingsContent}
        <div className={styles.personaSettingsButtons}>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => setUploadSettingsOpen(true)}
            id="persona-settings-upload-button"
          >
            Upload a new persona settings JSON file
          </Button>
          {contextInfo?.adminContext?.meta?.personaSettings && (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fff',
                  color: '#54B8AF',
                  '&:hover': {
                    backgroundColor: '#e3e3e3',
                  },
                }}
                id="persona-settings-view-current-button"
                onClick={() => setViewSettingsOpen(true)}
              >
                View current settings
              </Button>
              <PersonaSettingsDialog open={viewSettingsOpen} handleClose={() => setViewSettingsOpen(false)} />
            </>
          )}
          <UploadSettingsDialog open={uploadSettingsOpen} handleClose={() => setUploadSettingsOpen(false)} />
        </div>
      </div>

      <Tabs
        value={tabVal}
        onChange={(e: SyntheticEvent, newVal: number) => setTabVal(newVal)}
        aria-label="report-list-tabs"
        className={tabStyles.tabContainer}
      >
        <Tab label="Reports" {...a11yProps('reports')} sx={{ color: 'white' }} />
        <Tab label="Parses" {...a11yProps('parses')} sx={{ color: 'white' }} />
      </Tabs>

      <TabPanel value={tabVal} padding={0} index={0} name="reportList">
        <ReportList setReportCreateOpen={setReportCreateOpen} />
      </TabPanel>
      <TabPanel value={tabVal} padding={0} index={1} name="parses">
        <ParseList setReportCreateOpen={setReportCreateOpen} />
      </TabPanel>

      <CreateReport
        personaSettings={!!contextInfo?.adminContext?.meta?.personaSettings}
        loading={contextInfo.loading}
        open={reportCreateOpen}
        onClose={() => setReportCreateOpen(false)}
      />
    </div>
  );
};

export default ReportLandingPage;
