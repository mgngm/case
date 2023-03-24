import { useState, useRef, useEffect, useCallback, useReducer, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { HorizontalSplit, VerticalSplit } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { MoonLoader } from 'react-spinners';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';
import { validateLevers } from 'lambda/parse/report/validate';
import settingsSchema from 'schemas/persona-settings.schema.json' assert { type: 'json' };
import reportSchema from 'schemas/tesseract.schema.json' assert { type: 'json' };
import ConfirmSaveDialog from 'src/components/admin/preview/confirm-dialog';
import ProjectsAndInsightsEditor from 'src/components/admin/preview/editors/projects';
import ReportEditor from 'src/components/admin/preview/editors/report';
import SettingsEditor from 'src/components/admin/preview/editors/settings';
import ParseStatusIndicator from 'src/components/admin/preview/parse-status-indicator';
import styles from 'src/components/admin/preview/preview.module.scss';
import Input from 'src/components/shared/input';
import DatePicker from 'src/components/shared/input/date-picker';
import { DEFAULT_HYBRID_LOWER_PERCENT, DEFAULT_HYBRID_UPPER_PERCENT, DEFAULT_WORKING_DAYS } from 'src/constants/levers';
import { PREVIEW_ACCORDIONS, PROJECTS_ACCORDION, ReportState, REPORT_PREVIEW_MESSAGE } from 'src/constants/report';
import { ADMIN_REPORTS_ROUTE, ADMIN_ROUTE } from 'src/constants/routes';
import { ORGANISATIONS_TAG, PARSE_LIST_TAG, REPORT_PROJECTS_TAG, REPORT_TAG } from 'src/constants/slices';
import type { Project } from 'src/graphql';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useAccordionManager from 'src/hooks/use-accordion-manager';
import useContextInfo from 'src/hooks/use-context-info';
import { validatedPoll } from 'src/logic/client/poll';
import {
  fetchPreviewReportData,
  reportParseDuStatusValidation,
  reportParsePollFn,
  reportParseStatusValidation,
} from 'src/logic/client/report';
import { validateJson } from 'src/logic/libs/json';
import { ParseStatus } from 'src/models';
import {
  resetPreview,
  selectCustomProjects,
  selectInsights,
  setCustomProjects as setReduxCustomProjects,
  setInsights,
  setPreviewProjects,
  setPreviewReportData,
  setPreviewReportDate,
  setPreviewReportName,
} from 'src/slices/preview';
import {
  dashboardsGraphql,
  regenerateReportCsv,
  selectAllProjects,
  useFetchReportDataQuery,
  useFetchReportQuery,
  useLazyGetParseQuery,
  useListParseResultsQuery,
  useListProjectsQuery,
} from 'src/slices/report';
import type { Levers, PersonaSettings } from 'src/types/csv';
import type { UpdateReportWithProjectsProps } from 'src/types/preview';
import { focusEditorByRef, setEditorText } from './helpers';

interface ReportPreviewPageProps {
  previewReportId: string;
  newReport: boolean;
}

const ReportPreviewPage = ({ previewReportId, newReport }: ReportPreviewPageProps) => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const contextInfo = useContextInfo();
  const [getParse] = useLazyGetParseQuery(); // Need to do this later as part of the poll.

  const { toggleAccordion, isAccordionOpen, isAccordionClosed } = useAccordionManager(
    PREVIEW_ACCORDIONS,
    PROJECTS_ACCORDION
  );

  const [reportText, setReportText] = useState(''); //report editor text component state
  const [settingsText, setSettingsText] = useState(''); //settings editor text component state
  const [errorText, setErrorText] = useState('');
  const [errorTitle, setErrorTitle] = useState('');

  const [hybridLower, setHybridLower] = useState(DEFAULT_HYBRID_LOWER_PERCENT);
  const [hybridUpper, setHybridUpper] = useState(DEFAULT_HYBRID_UPPER_PERCENT);
  const [workingDays, setWorkingDays] = useState(DEFAULT_WORKING_DAYS);
  const leversValid = useMemo(
    () => validateLevers({ hybridLower, hybridUpper, workingDays }),
    [hybridLower, hybridUpper, workingDays]
  );

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [parseStatus, setParseStatus] = useState<ParseStatus | null>(null);
  const [duStatus, setDuStatus] = useState<ParseStatus>(ParseStatus.IN_PROGRESS);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const popupRef = useRef<WindowProxy | null>(null);
  const [split, setSplit] = useState<'horiz' | 'vert'>('vert');
  const jsonEditorRef = useRef<{ _input: HTMLTextAreaElement } | null>(null);
  const settingsEditorRef = useRef<{ _input: HTMLTextAreaElement } | null>(null);
  const settingsWrapperRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const insightsFromState = useAppSelector(selectInsights);
  const [selectedInsights, setSelectedInsights] = useState(insightsFromState);
  const customProjectsFromState = useAppSelector(selectCustomProjects);
  const [customProjects, setCustomProjects] = useState(customProjectsFromState);

  /**Fetch report data using this query because the query returns preview data from state if preview flag set.
  We will then set it in component state to make changes etc.

  DATA SOURCES: 
   - Component State - User Unsaved Changes
   - Preview Redux State - APPLY CHANGES data
   - DDB - Published data 

   This will also help with page re-renders and normalising the data sources.

   We are leaving these AS IS instead of using the useReport hook for now because I'm not sure of the damage changing them will cause rn, and this stuff is pretty bespoke,
  */
  const { previewData } = useFetchReportDataQuery(
    { id: previewReportId, preview: true },
    {
      skip: !previewReportId,
      selectFromResult: ({ data }) => ({
        previewData: data,
      }),
    }
  );

  const { reportMeta } = useFetchReportQuery(
    { id: previewReportId, preview: true }, //fetch preview data because editing the preview state will reflect changes here.
    {
      skip:
        !previewReportId ||
        previewReportId === ReportState.NOT_SET ||
        previewReportId === ReportState.NO_REPORT_AVAILABLE,
      selectFromResult: ({ data }) => ({
        reportMeta: data?.data,
      }),
    }
  );

  const { parseData } = useListParseResultsQuery(
    { context: contextInfo.adminContext.prettyId as string, filter: { parseReportId: { eq: previewReportId } } },
    {
      skip: !previewReportId || !contextInfo.adminContext.prettyId,
      selectFromResult: ({ data }) => ({ parseData: data?.data[0] }),
    }
  );

  const orgData = contextInfo.adminContext.meta;

  const { projectData } = useListProjectsQuery(
    { preview: true },
    { selectFromResult: ({ data }) => ({ projectData: data?.data && selectAllProjects(data.data) }) }
  );

  //PREVIEW data will only update when we invalidate the report tag on this id.
  //This will happen on an apply changes, or component mount.
  useEffect(() => {
    previewData?.data &&
      setEditorText({
        dataObject: previewData.data,
        setter: setReportText,
        editorType: 'report',
        setErrorTitle,
        setErrorText,
      });
  }, [previewData]);

  //reportMeta data will only update when we invalidate the appropriate tag, which will happen on
  //Update on publish,
  useEffect(() => {
    //If we are loading up for the first time, set the title of the page to the report meta.
    if (title === '') {
      reportMeta?.reportName && setTitle(reportMeta.reportName);
      reportMeta?.reportDate && setDate(new Date(reportMeta.reportDate));
    }

    //eslint-disable-next-line
  }, [reportMeta]);

  //Parse data is only updated if we hit apply changes and a REGEN is triggered.
  //At that point, we will load all our new data into preview state (in the callback) and kick the tags on the queries above to refresh the data.
  //At this point, it's save to set all the stuff on this component to that data.
  //ORG DATA should only fetch once, on load.
  useEffect(() => {
    setParseStatus(parseData?.status ?? null);

    //TODO: should we instantiate a poll here if the parse is IN_PROGRESS? :thinking:

    if (parseData?.levers) {
      let parsedLevers = JSON.parse(parseData?.levers);
      if (typeof parsedLevers === 'string') {
        //weird inconsistency in db with some levers double stringified occasionally.
        parsedLevers = JSON.parse(parsedLevers);
      }

      setHybridLower(parsedLevers.hybridLower);
      setHybridUpper(parsedLevers.hybridUpper);
      setWorkingDays(parsedLevers.workingDays);
    }

    if (parseData?.personaSettings) {
      // console.log('set PARSE data');
      setEditorText({
        dataObject: JSON.parse(parseData?.personaSettings),
        setter: setSettingsText,
        editorType: 'persona settings',
        setErrorText,
        setErrorTitle,
      });
      //If we don't have persona settings on the parse (old record maybe) then fall back to the org settings, these will be set on the parse the next time a regen runs
    } else if (orgData?.personaSettings) {
      setEditorText({
        dataObject:
          typeof orgData.personaSettings === 'string' ? JSON.parse(orgData.personaSettings) : orgData.personaSettings,
        setter: setSettingsText,
        editorType: 'persona settings',
        setErrorText,
        setErrorTitle,
      });
    }
  }, [parseData, orgData]);

  //Projects will only update when tags are invalidated (on apply changes, for little stuff or on regen for big.)
  useEffect(() => {
    setProjects(projectData ?? []);
  }, [projectData]);

  const [alignmentTriggered, setAlignmentTriggered] = useReducer(() => true, false);

  const clearError = () => {
    setErrorText('');
    setErrorTitle('');
  };

  const focusJson = useCallback(() => {
    if (jsonEditorRef.current) {
      focusEditorByRef(jsonEditorRef.current);
    }
  }, [jsonEditorRef]);

  const focusSettings = useCallback(() => {
    if (settingsEditorRef.current) {
      focusEditorByRef(settingsEditorRef.current);
    }

    if (settingsWrapperRef.current) {
      settingsWrapperRef.current.scrollTop = 0;
    }
  }, [settingsEditorRef, settingsWrapperRef]);

  const handleConfirmClose = (redirect = true) => {
    setConfirmOpen(false);
    if (redirect) {
      dispatch(resetPreview());
      router.push(ADMIN_ROUTE);
    }
  };

  /**
   * This function will take all the various bits we've messed with from component state, set them in the preview redux state, and if applicable send that data to the preview frame,
   *
   */
  const applyDataToPreview = useCallback(
    async ({ _reportText, _projects }: RefreshPreviewProps = {}) => {
      dispatch(setPreviewReportData(JSON.parse(_reportText ?? reportText)));
      dispatch(setPreviewProjects(_projects ?? projects ?? []));
      dispatch(setPreviewReportDate(date.toISOString().split('T')[0]));
      dispatch(setPreviewReportName(title));
      dispatch(setInsights(selectedInsights));
      dispatch(setReduxCustomProjects(customProjects));

      //Dispatch our custom projects and our insights here.

      //We need to invalidate tags here because all of our stuff comes from queries, which rely on these tags
      dispatch(dashboardsGraphql.util.invalidateTags([{ id: previewReportId, type: REPORT_TAG }, REPORT_PROJECTS_TAG]));
    },
    [customProjects, date, dispatch, previewReportId, projects, reportText, selectedInsights, title]
  );

  type RefreshPreviewProps = {
    _reportText?: string;
    _projects?: Project[];
  };

  const refreshPreview = useCallback(
    ({ _reportText, _projects }: RefreshPreviewProps) => {
      const payload = {
        type: REPORT_PREVIEW_MESSAGE,
        payload: {
          reportData: _reportText ?? reportText,
          customProjects: JSON.stringify(customProjects),
          projects: JSON.stringify(_projects ?? projects),
          insights: JSON.stringify(selectedInsights),
          reportDate: date.toISOString().split('T')[0],
          reportName: title,
        },
      };
      //Report text and settings text are already stringified, so we don't need to parse it when sending it to the preview instance.
      if (iframeRef?.current && window) {
        iframeRef.current.contentWindow?.postMessage(payload, window.location.origin);
      }

      // tell the popup window to update
      if (popupRef?.current && window) {
        popupRef.current?.postMessage(payload, window.location.origin);
      }
    },
    [customProjects, date, projects, reportText, selectedInsights, title]
  );

  const updateReportWithProjects = ({ projects, customProjects, insights }: UpdateReportWithProjectsProps) => {
    if (projects) {
      setProjects(projects);
    }

    if (customProjects) {
      setCustomProjects(customProjects);
    }

    if (insights) {
      setSelectedInsights(insights);
    }
  };

  // when report is first added to the page, focus the input
  // since it's the main thing we want to do, but also
  // so that the editor alignment occurs.
  useEffect(() => {
    if (reportText?.length && !alignmentTriggered) {
      focusJson();
      setAlignmentTriggered();
    }
  }, [reportText, alignmentTriggered, focusJson]);

  //Poll to check on DU status.
  const DuPoll = useCallback(
    () =>
      parseData?.id &&
      validatedPoll({
        debug: !!router.query.verbose,
        interval: 5000,
        maxAttempts: 60,
        fn: (debug) =>
          reportParsePollFn({
            trigger: getParse,
            parseId: parseData?.id,
            debug,
          }),
        validate: (parse, debug) => reportParseDuStatusValidation({ parse, debug }),
      })
        .then(() => {
          setParseStatus(ParseStatus.SUCCESS);
          setDuStatus(ParseStatus.SUCCESS);
        })
        .catch((err) => {
          console.error(err);
          setDuStatus(ParseStatus.ERROR);
        }),
    [getParse, parseData?.id, router.query.verbose]
  );

  // First thing we want to do when we move to the page is start polling for the DU batch processing status
  useEffect(() => {
    if (previewReportId && parseData?.id) {
      DuPoll();
    }
  }, [DuPoll, previewReportId, parseData?.id]);

  //convert name/date to component state stuff.
  const regenerateReport = useCallback(
    async (projectKey?: string) => {
      if (!parseData?.id) {
        return;
      }

      const formattedDate = date.toDateString().split('T')[0];
      await dispatch(
        regenerateReportCsv({
          reportId: parseData?.parseReportId ?? '',
          parseId: parseData?.id,
          reportName: title,
          reportDate: formattedDate,
          inputAnalyticCsv: parseData?.inputAnalyticCsv ?? '',
          inputProjectCsv: projectKey ?? parseData?.inputProjectCsv ?? '',
          levers: {
            hybridLower,
            hybridUpper,
            workingDays,
          },
          personaSettings: JSON.parse(settingsText) as PersonaSettings,
        })
      ).unwrap();

      //Start new poll now
      setParseStatus(ParseStatus.IN_PROGRESS);
      setDuStatus(ParseStatus.IN_PROGRESS);

      //WAit before we start the poll because of a race condition on the parse status being polled.
      // await wait(3000);

      //Technically we shouldn;'t have to wait here because the regenerate call will auto set the parse to IN_PROGRESS.
      await validatedPoll({
        interval: 5000,
        maxAttempts: 60,
        status: ParseStatus.SUCCESS, // THIS IS ONLY USED FOR LOGGING.
        fn: (debug) =>
          reportParsePollFn({
            trigger: getParse,
            parseId: parseData?.id,
            debug,
          }),
        validate: (parse, debug) => reportParseStatusValidation({ parse, desiredStatus: ParseStatus.SUCCESS, debug }),
      })
        .then(async () => {
          setParseStatus(null);
          //We want to get the refreshed data from the parse - and put that in preview state, then pass things to the preview
          const { reportData: _reportData, projectData: _projectData } = await dispatch(
            fetchPreviewReportData(previewReportId, true)
          );
          //invalidate tags here
          dispatch(
            dashboardsGraphql.util.invalidateTags([REPORT_TAG, REPORT_PROJECTS_TAG, ORGANISATIONS_TAG, PARSE_LIST_TAG])
          );

          //Projects fro mthe regenerate are passed to the preview state ok BUT we also need to set it on this page for the projects section.
          setProjects(_projectData);

          // pass data directly to this function to pass to preview
          //When we are regenerating we want to persist EVERYTHING we've done but the reportText and the project data which come from the regen.

          //Insights and custom projects persisst
          refreshPreview({
            _reportText: JSON.stringify(_reportData),
            _projects: _projectData,
          });

          DuPoll();
        })
        .catch((err) => {
          console.error(err);
          setParseStatus(ParseStatus.ERROR);
          setDuStatus(ParseStatus.ERROR);
        });
    },
    [
      DuPoll,
      date,
      dispatch,
      hybridLower,
      hybridUpper,
      getParse,
      parseData?.id,
      parseData?.inputAnalyticCsv,
      parseData?.inputProjectCsv,
      parseData?.parseReportId,
      previewReportId,
      refreshPreview,
      settingsText,
      title,
      workingDays,
    ]
  );

  const applyChanges = useCallback(
    (reportJson?: string, settingsJson?: string) => {
      const preview: RefreshPreviewProps = {};

      if (!reportJson) {
        reportJson = reportText;
      } else {
        preview._reportText = reportJson;
      }

      if (!settingsJson) {
        settingsJson = settingsText;
      }

      //Check report & settings validity first.
      const validReport = validateJson(reportJson, reportSchema);
      const validSettings = validateJson(settingsJson, settingsSchema);

      if (validReport.valid === false || validSettings.valid === false) {
        setErrorText(validReport.valid === false ? validReport.error : validSettings.error);
        setErrorTitle(validReport.valid === false ? validReport.errorTitle : validSettings.errorTitle);
        return;
      }
      //Everything is good, lets load values into state and refresh
      //first thing we want to is clear all errors and set all our data in preview state.
      applyDataToPreview(preview);
      clearError();

      /* 
      Regen only changes on 
        - project change (project CSV changes)
        - persona settings change
        - levers change 
    */
      const parsedSettings = JSON.parse(settingsJson);
      const settingsChanged = !isEqual(parsedSettings, JSON.parse(parseData?.personaSettings ?? '{}'));

      let parsedLevers: Levers = JSON.parse(parseData?.levers ?? '{}');
      if (typeof parsedLevers === 'string') {
        //weird inconsistency in db with some levers double stringified occasionally.
        parsedLevers = JSON.parse(parsedLevers);
      }

      const leversChanged =
        hybridLower !== parsedLevers?.hybridLower ||
        hybridUpper !== parsedLevers?.hybridUpper ||
        workingDays !== parsedLevers?.workingDays;

      //If either of these have changed we need to reparse
      if (settingsChanged || leversChanged) {
        regenerateReport();
      } else {
        //then we want to send a message to the preview instance of the app, so that app stores its data in the preview slice too
        refreshPreview(preview);
      }
    },
    [
      applyDataToPreview,
      hybridLower,
      hybridUpper,
      parseData?.levers,
      parseData?.personaSettings,
      refreshPreview,
      regenerateReport,
      reportText,
      settingsText,
      workingDays,
    ]
  );

  return (
    <div id="report-preview" className={styles.previewContent}>
      <div className={styles.previewTitle}>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            dispatch(resetPreview());
            router.push(ADMIN_REPORTS_ROUTE);
          }}
          color="secondary"
        >
          <ArrowBackIcon />
        </IconButton>
        <ParseStatusIndicator parseStatus={parseStatus} duStatus={duStatus} theme={theme} parseId={parseData?.id} />
        <ToggleButtonGroup
          id="view-toggle-wrapper"
          sx={{ ml: 'auto' }}
          value={split}
          onChange={(e, val) => setSplit(val)}
          exclusive
        >
          <ToggleButton value="vert" sx={{ paddingX: '11px' }} id="view-toggle-vertical">
            <VerticalSplit />
          </ToggleButton>
          <ToggleButton value="horiz" sx={{ paddingX: '11px' }} id="view-toggle-horizontal">
            <HorizontalSplit />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className={clsx(styles.previewWrapper, styles[split])} id="preview-wrapper">
        <div className={styles.jsonWrapper} id="preview-data-wrapper">
          <div className={styles.jsonInner}>
            {errorText !== '' ? (
              <div className={styles.jsonError}>
                <p className={styles.errorTitle}>
                  <ErrorIcon />
                  {errorTitle}
                </p>
                <p className={styles.errorMessage}>{errorText}</p>
              </div>
            ) : null}
            {reportText !== null && window ? (
              <>
                <div className={styles.infoWrapper}>
                  <div className={styles.nameWrapper}>
                    <label htmlFor="report-name">Report:</label>
                    <Input
                      id="report-name"
                      name="name"
                      value={title}
                      onChange={(ev) => setTitle(ev.target.value)}
                      className={styles.nameInput}
                    />
                  </div>
                  <div className={styles.dateInput}>
                    <DatePicker
                      id="report-date"
                      name="date"
                      dateFormat="yyyy-MM-dd"
                      selected={date}
                      onChange={(date) => date && setDate(date)}
                      inputProps={{
                        className: styles.dateInnerInput,
                      }}
                    />
                  </div>
                </div>
                <ReportEditor
                  reportText={reportText}
                  setReportText={setReportText}
                  toggleAccordion={toggleAccordion}
                  isAccordionClosed={isAccordionClosed}
                  isAccordionOpen={isAccordionOpen}
                  focusJson={focusJson}
                  jsonEditorRef={jsonEditorRef}
                  applyChanges={applyChanges}
                  setErrorTitle={setErrorTitle}
                  setErrorText={setErrorText}
                />
                <ProjectsAndInsightsEditor
                  toggleAccordion={toggleAccordion}
                  isAccordionClosed={isAccordionClosed}
                  projects={projects}
                  updateReportFn={updateReportWithProjects}
                  orgId={contextInfo.adminContext.prettyId as string}
                  date={date.toISOString().split('T')[0]}
                  regenTrigger={regenerateReport}
                  customProjects={customProjects}
                  selectedInsights={selectedInsights}
                  inputProjectCsv={parseData?.inputProjectCsv ?? ''}
                  warnings={(parseData?.warnings as string[]) ?? []}
                />
                <SettingsEditor
                  setHybridLower={setHybridLower}
                  setHybridUpper={setHybridUpper}
                  setWorkingDays={setWorkingDays}
                  settingsText={settingsText}
                  setSettingsText={setSettingsText}
                  toggleAccordion={toggleAccordion}
                  isAccordionClosed={isAccordionClosed}
                  isAccordionOpen={isAccordionOpen}
                  focusSettings={focusSettings}
                  settingsWrapperRef={settingsWrapperRef}
                  settingsEditorRef={settingsEditorRef}
                  duStatus={duStatus}
                  hybridLower={hybridLower}
                  hybridUpper={hybridUpper}
                  workingDays={workingDays}
                />
              </>
            ) : null}
          </div>
          <div className={styles.applyWrapper}>
            <Button
              id="apply-changes-button"
              variant="contained"
              endIcon={<PlaylistAddCheckIcon />}
              color="secondary"
              disabled={
                !leversValid ||
                date.getFullYear() > 9999 ||
                parseStatus === ParseStatus.IN_PROGRESS ||
                duStatus === ParseStatus.IN_PROGRESS
              }
              onClick={async (e) => {
                e.preventDefault();
                applyChanges();
              }}
              sx={{
                '&:disabled': (theme) => theme.mixins.disabledButtonLight.contained,
              }}
            >
              Apply changes
            </Button>
          </div>
        </div>
        <div className={styles.iframeWrapper}>
          <iframe id="preview-iframe" ref={iframeRef} src={`/?preview=true`} className={styles.iframe}>
            Loading preview...
          </iframe>

          <div className={styles.saveWrapper}>
            <Button
              component="a"
              id="preview-new-window-button"
              href="#"
              startIcon={<OpenInBrowserIcon />}
              onClick={(ev: MouseEvent<HTMLAnchorElement>) => {
                ev.preventDefault();
                const popupWindow = window.open(`/?preview=true`, 'Report Preview');
                popupRef.current = popupWindow;
              }}
            >
              View in a new window
            </Button>
            <Button //TODO: CHANGE TO LOADING BUTTON FROM MUI
              id="save-and-publish-button"
              disabled={parseStatus === ParseStatus.IN_PROGRESS || duStatus === ParseStatus.IN_PROGRESS}
              endIcon={
                parseStatus === ParseStatus.IN_PROGRESS ? (
                  <div style={{ display: 'flex', textAlign: 'left' }}>
                    <MoonLoader size={15} />
                  </div>
                ) : (
                  <PublishedWithChangesIcon />
                )
              }
              variant="contained"
              color="primary"
              sx={{
                '&:disabled': (theme) => theme.mixins.disabledButtonLight.contained,
              }}
              onClick={(e) => {
                e.preventDefault();

                const validReport = validateJson(reportText, reportSchema);

                if (reportText && validReport !== false) {
                  clearError();
                  setConfirmOpen(true);
                } else {
                  setErrorText(validReport.error);
                  setErrorTitle(validReport.errorTitle);
                }
              }}
            >
              Save & Publish
            </Button>
          </div>
        </div>
      </div>
      {confirmOpen ? (
        <ConfirmSaveDialog
          newReport={newReport}
          parseId={parseData?.id ?? ''}
          prettyOrgId={contextInfo.adminContext.prettyId as string}
          orgId={contextInfo.adminContext.id as string}
          reportId={previewReportId}
          open={confirmOpen}
          handleClose={handleConfirmClose}
        />
      ) : null}
    </div>
  );
};

export default ReportPreviewPage;
