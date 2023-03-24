import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { PayloadAction, EntityState } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { API, Storage } from 'aws-amplify';
import csv from 'csvtojson';
import { memoizeWithArgs } from 'proxy-memoize';
import { v4 } from 'uuid';
import type { AppThunk, RootState } from 'src/store';
import { REPORT_PARSE_QUEUE } from 'src/constants/api';
import {
  PROJECT_CSV_FILE_KEY,
  REPORT_CSV_FILE_KEY,
  ReportState,
  KEY_SITES_CSV_FILE_KEY,
  UPGRADING_SITES_CSV_FILE_KEY,
  PERSONA_SETTINGS_FILE_KEY,
} from 'src/constants/report';
import { SQS_MESSAGE_API_ROUTE } from 'src/constants/routes';
import { PARSE_LIST_TAG, REPORT_LIST_TAG, REPORT_PROJECTS_TAG, REPORT_TAG } from 'src/constants/slices';
import { AccessLevel, ParseStatus, ReportStatus } from 'src/graphql';
import type {
  ModelReportFilterInput,
  UpdateReportMutation,
  Project,
  ModelProjectFilterInput,
  Parse,
  ModelParseFilterInput,
  Report,
  UpdateReportInput,
  UpdateProjectInput,
  UpdateProjectMutation,
} from 'src/graphql';
import { createParse, createReport, updateParse, updateProject, updateReport } from 'src/graphql/mutations';
import { getParse, getReport, listProjects, listReports, parseByContext, reportByContext } from 'src/graphql/queries';
import { graphQL, graphqlOperation } from 'src/logic/client/graphql';
import type { WithErrorPolicy } from 'src/logic/client/graphql/error';
import { GraphQLErrorPolicyError } from 'src/logic/client/graphql/error';
import type { ReturnFromQuery } from 'src/logic/client/graphql/types';
import { assert, isNotDeleted, nonNullable } from 'src/logic/libs/helpers';
import { serializeError } from 'src/logic/libs/json';
import { createAppAsyncThunk } from 'src/slices';
import { serialiseAmplifyError, getAuthHeader, baseApi } from 'src/slices/api';
import { contextApi, searchContexts, selectAdminContextId, selectPrettyId, setReportContext } from 'src/slices/context';
import { resetReportPersonaFilter } from 'src/slices/dashboard';
import { graphQLHelper } from 'src/slices/graphql';
import {
  selectCustomProjects,
  selectInsights,
  selectPreviewProjects,
  selectPreviewReportData,
  selectPreviewReportDate,
  selectPreviewReportName,
} from 'src/slices/preview';
import { selectCurrentUserSub, userSignedOut, selectUserAccessLevel } from 'src/slices/users';
import type { Levers, PersonaSettings } from 'src/types/csv';
import type { CustomProject } from 'src/types/projects';
import type { ParseMetaFields, ReportData } from 'src/types/report';
import type { DashboardData } from 'src/types/slices';

/**
  Generate graphQL filter for access level based on user access level attribute.
 * @param accessLevel 
 */
export const generateAccessLevelFilter = (accessLevel: AccessLevel): ModelReportFilterInput[] => {
  //default org level access filter.
  const filter: ModelReportFilterInput[] = [{ accessLevel: { eq: AccessLevel.ORGANISATION } }];

  if (accessLevel === AccessLevel.PARTNER || accessLevel === AccessLevel.GLOBAL) {
    filter.push({ accessLevel: { eq: AccessLevel.PARTNER } });
  }

  if (accessLevel === AccessLevel.GLOBAL) {
    filter.push({ accessLevel: { eq: AccessLevel.GLOBAL } });
  }

  return filter;
};

export const selectNewReport = createAppAsyncThunk(
  'report/selectNewReport',
  async (
    {
      reportId,
      context,
    }: {
      reportId: string | null;
      context: string;
    },
    { dispatch, getState }
  ) => {
    const userSub = selectCurrentUserSub(getState());
    const accessLevel = selectUserAccessLevel(getState());
    let newReportId = reportId;
    let refReportId;

    const userContextsPromise = dispatch(contextApi.endpoints.getUserContext.initiate({ userSub })); //Dont need a force refetch we're pretty chill right now.

    let userContexts;
    //Fetch available user contexts - we use these contexts for if we need to update the report context
    try {
      userContexts = await userContextsPromise.unwrap();
    } finally {
      // Remove the subscriptions here.
      userContextsPromise.unsubscribe();
    }

    const newContext = searchContexts(userContexts, context);
    //Got the report context so lets list all of our things
    if (newContext) {
      //If we don't have a report ID (say we're just logging in) then go and figure one out.
      const reportListPromise = dispatch(
        dashboardsGraphql.endpoints.listReports.initiate(
          {
            context: selectPrettyId(userContexts, newContext.id) as string,
            filter: { or: generateAccessLevelFilter(accessLevel) },
          },
          { forceRefetch: true }
        )
      );

      let reportList: Report[] = [];
      try {
        ({ data: reportList } = await reportListPromise.unwrap());
      } finally {
        reportListPromise.unsubscribe();
      }

      if (!newReportId) {
        //Fetch report list.

        if (reportList.length > 0) {
          //If we have reports available, attempt to set this report (and ref report as the next in the list)
          newReportId = reportList[0]?.id;
          refReportId = reportList[1]?.id ?? ReportState.NO_REPORT_AVAILABLE;
        } else {
          //Otherwise, set them as not available
          newReportId = ReportState.NO_REPORT_AVAILABLE;
          refReportId = ReportState.NO_REPORT_AVAILABLE;
        }
      } else {
        //If we DO have a report ID, all we need to do is figure out which one it is and attempt to set the NEXT one in the list to the ref report
        const index = reportList.findIndex((_report) => _report?.id === newReportId);
        refReportId = reportList[index + 1]?.id ?? ReportState.NO_REPORT_AVAILABLE;
      }

      // reset filter state
      dispatch(resetReportPersonaFilter());

      //Now we can set all of our things here.
      dispatch(setRefReportId(refReportId));
      dispatch(setSelectedReportId(newReportId));
      dispatch(setReportContext(newContext.id));

      //If we have a valid report set, we want to cheekily set this as the default report context on the user
      if (newReportId !== ReportState.NO_REPORT_AVAILABLE) {
        const userSub = selectCurrentUserSub(getState());
        //Need to update user information here.
        await fetch(`/api/users/${userSub}/attributes/`, {
          method: 'POST',
          body: JSON.stringify({ userSub, defaultContext: newContext.id }),
          headers: new Headers({ authorization: await getAuthHeader() }),
        });
      }
    } else {
      //No context available, don't set anything.
      dispatch(setSelectedReportId(ReportState.NO_REPORT_AVAILABLE));
      dispatch(setRefReportId(ReportState.NO_REPORT_AVAILABLE));
    }
  }
);

export const processSitesCsv = async (sitesCsv: File | null) => {
  if (sitesCsv && sitesCsv instanceof File) {
    // get the file as text
    const sitesContent = await sitesCsv.text();

    // parse it as json (so we don't have to deal with csv quirks ourselves)
    const jsonData: Record<string, string>[] = await csv().fromString(sitesContent);

    // grab the sites from the parsed json
    const sites: string[] = jsonData.map((site) => Object.values(site)[0]);

    return sites;
  }

  return [];
};

/**
 * async thunk creator for uploading report CSVs for parsing
 */
export const uploadReportCsv = createAppAsyncThunk(
  'report/uploadCsv',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const parseId = v4();
      const reportId = v4();

      const orgId = formData.get('org-id');
      const rawPersonaSettings = formData.get(PERSONA_SETTINGS_FILE_KEY) as string;
      const accessLevel = selectUserAccessLevel(getState());
      if (!orgId || !rawPersonaSettings) {
        throw new Error('No organisation for report');
      }

      if (!rawPersonaSettings) {
        throw new Error('No persona settings for report');
      }

      //We have to parse these settings here as they get restringified on the metaJSON message thing
      const personaSettings: PersonaSettings = JSON.parse(rawPersonaSettings);
      const reportName = `${formData.get('name') ?? orgId}`;
      const reportDate = formData.get('date');

      const keySitesCSV = formData.get(KEY_SITES_CSV_FILE_KEY);
      const upgradingSitesCSV = formData.get(UPGRADING_SITES_CSV_FILE_KEY);

      assert(
        typeof reportDate === 'string' &&
          typeof orgId === 'string' &&
          keySitesCSV instanceof File &&
          upgradingSitesCSV instanceof File,
        'invalid form'
      ); // keep typescript happy - shouldn't happen in practicality

      const levers: Levers = {
        hybridLower: parseFloat(formData.get('hybrid-lower') as string),
        hybridUpper: parseFloat(formData.get('hybrid-upper') as string),
        workingDays: parseFloat(formData.get('working-days') as string),
        keySites: await processSitesCsv(keySitesCSV),
        upgradingSites: await processSitesCsv(upgradingSitesCSV),
      };

      // create report record
      await graphQL({
        query: createReport,
        variables: {
          input: {
            id: reportId,
            context: orgId,
            reportDate,
            reportName,
            customProjects: '[]', //always empty array nice and easy.
            insightIds: [],
            reportStatus: ReportStatus.UPLOADING,
            accessLevel, //default user access level can be overwritten on publish
          },
        },
      });

      // create parse record
      await graphQL({
        query: createParse,
        variables: {
          input: {
            id: parseId,
            parseReportId: reportId,
            status: ParseStatus.UPLOADING,
            startDateTime: new Date().toISOString(),
            context: orgId,
            levers: JSON.stringify(levers),
            personaSettings: rawPersonaSettings,
          },
        },
      });

      const reportCSV = formData.get(REPORT_CSV_FILE_KEY);
      const projectCSV = formData.get(PROJECT_CSV_FILE_KEY);

      if (reportCSV instanceof File && projectCSV instanceof File) {
        const reportKeyName = reportName.replace(/\s/g, '-');

        // send to S3
        const now = Date.now();
        const oneHour = 1000 * 60 * 60;
        const reportS3 = await Storage.put(
          `upload/${formData.get('org-id')}/${now}-report-${reportKeyName}`,
          reportCSV,
          {
            contentType: 'text/csv',
            expires: new Date(now + oneHour),
          }
        );

        const projectS3 = await Storage.put(
          `upload/${formData.get('org-id')}/${now}-project-${reportKeyName}`,
          projectCSV,
          {
            contentType: 'text/csv',
            expires: new Date(now + oneHour),
          }
        );

        const metaJSONFields: ParseMetaFields = {
          parseId,
          reportId,
          inputAnalyticCsv: reportS3.key,
          inputProjectCsv: projectS3.key,
          reportDate,
          orgId,
          levers,
          personaSettings,
          reportName,
          parseVersion: 1, //always one on a new parse, right ?
        };

        await fetch(SQS_MESSAGE_API_ROUTE, {
          method: 'POST',
          body: JSON.stringify({
            queue: REPORT_PARSE_QUEUE,
            messageBody: metaJSONFields,
          }),
          headers: { 'content-type': 'application/json', authorization: await getAuthHeader() },
        });

        //Here we'd make a call to the subscription on graphQL.
        return { ok: true, error: false, parseId };
      } else {
        throw new Error('CSV form file invalid');
      }
    } catch (err) {
      console.error(err);
      return rejectWithValue(err instanceof Error ? serializeError(err) : err);
    }
  }
);

export const regenerateReportCsv = createAppAsyncThunk(
  'report/regenerate',
  async (
    {
      parseId,
      reportId,
      inputAnalyticCsv,
      inputProjectCsv,
      reportName, //to go
      reportDate, //to go
      levers,
      personaSettings,
    }: {
      parseId: string;
      reportId: string;
      inputAnalyticCsv: string;
      inputProjectCsv: string;
      reportName: string;
      reportDate: string;
      levers: Levers;
      personaSettings: PersonaSettings;
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    const orgId = selectAdminContextId(getState());

    try {
      //Need to get current parse for version for the update mutation to set it as in progress again.
      const parseRes = await graphQL({
        query: getParse,
        variables: {
          id: parseId,
        },
      });

      if (parseRes) {
        const parseVersion = parseRes?.data?.getParse?._version;

        //Send settings changes here.
        if (parseVersion) {
          // create parse record
          await graphQL({
            query: updateParse,
            variables: {
              input: {
                id: parseId,
                status: ParseStatus.IN_PROGRESS,
                _version: parseVersion,
                inputProjectCsv,
                personaSettings: JSON.stringify(personaSettings),
              },
            },
          });
          //kick all the components linked to this parse (like preview...)
          dispatch(dashboardsGraphql.util.invalidateTags([PARSE_LIST_TAG]));

          //Create New Meta File (for re-parse)
          const metaJSONFields: ParseMetaFields = {
            regenerate: true, //REQUIRED for deletion of existing DUs on parse lambda
            personaSettings,
            parseId,
            parseVersion,
            reportId,
            inputAnalyticCsv,
            inputProjectCsv,
            reportName,
            reportDate,
            orgId,
            levers,
          };

          // trigger the parse lambda via sqs
          await fetch(SQS_MESSAGE_API_ROUTE, {
            method: 'POST',
            body: JSON.stringify({
              queue: REPORT_PARSE_QUEUE,
              messageBody: metaJSONFields,
            }),
            headers: { 'content-type': 'application/json', authorization: await getAuthHeader() },
          });

          //Here we'd make a call to the subscription on graphQL.
          return { ok: true, error: false, parseId };
        } else {
          throw new Error('Cant update parse entry, exiting...');
        }
      }
    } catch (err) {
      console.error(err);
      return rejectWithValue(err instanceof Error ? serializeError(err) : serialiseAmplifyError(err));
    }
  }
);

export const initialiseReport =
  (context: string): AppThunk<void> =>
  async (dispatch) => {
    //This will trigger the select report function to go and figure out a suitable report.
    dispatch(selectNewReport({ reportId: null, context }));
  };

type ReportUpdateParams = {
  id: string;
  _version: number;
  customProjects?: string; //stringified
  projectIds?: string[];
  insightIds?: string[];
};

export const projectAdapter = createEntityAdapter<Project>();

export const dashboardsGraphql = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchReport: build.query<WithErrorPolicy<Report>, { id: string; preview?: boolean }>({
      queryFn: async ({ id, preview }, { getState }) => {
        if (preview) {
          const reportName = selectPreviewReportName(getState() as RootState) ?? null;
          const reportDate = selectPreviewReportDate(getState() as RootState) ?? null;
          const customProjects = selectCustomProjects(getState() as RootState) ?? null;
          const previewProjects = selectPreviewProjects(getState() as RootState) ?? null;
          const selectedInsights = (selectInsights(getState() as RootState) as string[]) ?? null;

          //Return our custom stuff back.
          const report = {
            reportName: reportName,
            reportDate: reportDate,
            customProjects: JSON.stringify(customProjects) ?? [],
            projectIds: previewProjects.map(({ id }) => id) ?? [],
            insightIds: selectedInsights ?? [],
          } as Report;

          return { data: { data: report, errors: [] } };
        }
        try {
          let reportRes = await graphQL({
            query: getReport,
            variables: { id },
          });

          if (reportRes?.data?.getReport) {
            let report = reportRes.data.getReport;
            const reportData = report.reportData ? JSON.parse(report.reportData) : null;
            let update = false;
            const updateParams: ReportUpdateParams = {
              id: report.id,
              _version: report._version,
            };

            if (reportData && !report.projectIds) {
              update = true;
              updateParams.projectIds = report.projects?.items?.map((item) => item?.id).filter(nonNullable) ?? [];
            }

            if (reportData && !report.insightIds) {
              update = true;
              updateParams.insightIds = report.insights?.items?.map((item) => item?.id).filter(nonNullable) ?? [];
            }

            if (reportData && !report.customProjects) {
              update = true;
              updateParams.customProjects = JSON.stringify(reportData?.projectsPage?.customProjects ?? []);
            }

            if (update) {
              console.log('*** OLD REPORT DETECTED ***', report);
              console.log('Upading with following params: ', updateParams);

              try {
                //Update report with new kets set
                await graphQL({
                  query: updateReport,
                  variables: {
                    input: {
                      ...updateParams,
                    },
                  },
                });

                //Re fetch latest result
                reportRes = await graphQL({
                  query: getReport,
                  variables: { id },
                });

                if (reportRes.data.getReport) {
                  //Set the report to be returned properly.
                  report = reportRes.data.getReport;
                } else {
                  // for nice message formatting
                  throw new GraphQLErrorPolicyError('all', reportRes.data, reportRes.errors);
                }
              } catch (err) {
                console.error(err);
              }
            }

            return { data: { data: report, errors: reportRes.errors } };
          } else {
            throw new Error(`Could not find report data: '${id}', Preview: '${preview}'`);
          }
        } catch (err) {
          console.error(err);
          return {
            error: { status: 500, data: err instanceof Error ? serializeError(err) : err },
          };
        }
      },
      providesTags: (res, err, arg) => [{ type: REPORT_TAG, id: arg.id }],
    }),
    fetchReportData: build.query<WithErrorPolicy<DashboardData>, { id: string; preview?: boolean }>({
      queryFn: async ({ id, preview }, { getState }) => {
        if (preview) {
          return { data: { data: selectPreviewReportData(getState() as RootState), errors: [] } };
        }
        try {
          const reportRes = await graphQL({
            query: getReport,
            variables: { id },
          });

          if (reportRes?.data?.getReport?.reportData) {
            const report = reportRes.data.getReport.reportData;
            return { data: { data: JSON.parse(report), errors: reportRes.errors } };
          } else {
            // TODO: This allows pre-dynamo reports to work, it should be removed
            console.warn(`Report ${id} does not have reportData in DB, falling back to s3`);
            if (reportRes?.data?.getReport?.s3Key) {
              const s3Report = await Storage.get(reportRes.data.getReport.s3Key, {
                contentType: 'application/json',
                download: true,
              });
              if (s3Report.Body) {
                // convert the downloaded report into JSON
                const report: ReportData = JSON.parse(await (s3Report.Body as Blob).text());

                // set the reportData back on the db
                try {
                  await graphQL({
                    query: updateReport,
                    variables: {
                      input: {
                        id,
                        _version: reportRes?.data?.getReport?._version,
                        reportData: JSON.stringify(report),
                      },
                    },
                  });
                } catch (err) {
                  console.error(err);
                }

                return { data: { data: report, errors: [] } };
              }
            }

            throw new Error('Could not find report data');
          }
        } catch (err) {
          console.error(err);
          return {
            error: { status: 500, data: err instanceof Error ? serializeError(err) : err },
          };
        }
      },
      providesTags: (res, err, arg) => [{ type: REPORT_TAG, id: arg.id }],
    }),
    listReports: build.query<
      WithErrorPolicy<Report[]>,
      { context: string; filter: ModelReportFilterInput; includeUnpublished?: boolean; includeForDeletion?: boolean }
    >({
      ...graphQLHelper({
        query: ({ context, filter }) => ({ query: reportByContext, variables: { context, filter } }),
        transformResponse: ({ data, errors }, _, arg) => {
          const filterStatus = [ReportStatus.PUBLISHED];
          if (arg.includeUnpublished) {
            filterStatus.push(ReportStatus.UPLOADING);
          }

          if (arg.includeForDeletion) {
            filterStatus.push(ReportStatus.FOR_DELETION);
          }
          return {
            data:
              (data.reportByContext?.items
                .filter((r) => !r?._deleted)
                .filter(
                  (r) => r?.reportStatus && filterStatus.includes(r?.reportStatus)
                  //TIM !!!! we could potentially whitelist 'in progress' here to allow someone to come back to a report if they accidentally go back without publsihing? we can do that with the db I think.
                )
                .sort((a, b) =>
                  (b?.reportDate ?? '1970-01-01').localeCompare(a?.reportDate ?? '1970-01-01')
                ) as Report[]) ?? [],
            errors,
          };
        },
      }),
      providesTags: (res, err, arg) => [{ type: REPORT_LIST_TAG, id: arg.context }],
    }),
    listAllReports: build.query<
      WithErrorPolicy<Report[]>,
      { filter?: ModelReportFilterInput; includeUnPublished: boolean }
    >({
      ...graphQLHelper({
        query: ({ filter }) => ({ query: listReports, variables: { filter } }),
        transformResponse: ({ data, errors }, meta, arg) => {
          const items = data.listReports?.items;
          const itemsToSort = arg.includeUnPublished
            ? items
            : items?.filter((r) => r?.reportStatus === ReportStatus.PUBLISHED);

          return {
            data:
              (itemsToSort
                ?.filter(isNotDeleted)
                .sort((a, b) =>
                  (b?.reportDate ?? '1970-01-01').localeCompare(a?.reportDate ?? '1970-01-01')
                ) as Report[]) ?? [],
            errors,
          };
        },
      }),
      providesTags: [REPORT_LIST_TAG],
    }),
    listParseResults: build.query<WithErrorPolicy<Parse[]>, { context: string; filter?: ModelParseFilterInput }>({
      ...graphQLHelper({
        query: ({ context, filter }) => ({ query: parseByContext, variables: { context, filter } }),
        transformResponse: ({ data, errors }) => ({
          data: data.parseByContext?.items.filter(nonNullable) as Parse[], //.sort((a, b) => b?.reportDate?.localeCompare(a.reportDate)),
          errors,
        }),
      }),
      providesTags: [{ type: PARSE_LIST_TAG }],
    }),
    getParse: build.query<WithErrorPolicy<Parse | null>, { id: string; filter?: ModelParseFilterInput }>({
      ...graphQLHelper({
        query: ({ id, filter }) => ({ query: getParse, variables: { id, filter } }),
        transformResponse: ({ data, errors }) => ({
          data: data.getParse?._deleted !== true ? (data.getParse as Parse) : null,
          errors,
        }),
      }),
    }),
    updateReport: build.mutation<WithErrorPolicy<UpdateReportMutation>, { report: UpdateReportInput; context: string }>(
      {
        ...graphQLHelper({ query: ({ report }) => ({ query: updateReport, variables: { input: report } }) }),
        invalidatesTags: (res, err, arg) =>
          res?.data?.updateReport?._lastChangedAt ? [{ type: REPORT_LIST_TAG, id: arg.context }] : [],
      }
    ),
    listProjects: build.query<
      WithErrorPolicy<EntityState<Project>>,
      { filter?: ModelProjectFilterInput; preview: boolean }
    >({
      queryFn: async ({ filter, preview }, api, extraOptions, baseQuery) => {
        try {
          if (preview) {
            return {
              data: {
                data: projectAdapter.setAll(
                  projectAdapter.getInitialState(),
                  selectPreviewProjects(api.getState() as RootState)
                ),
                errors: [],
              },
            };
          }
          // handle preview
          const resp = await baseQuery(graphqlOperation(listProjects, { filter }));
          if (resp.error) {
            return resp;
          }
          const data = resp.data as WithErrorPolicy<ReturnFromQuery<typeof listProjects>>;
          return {
            data: {
              data: projectAdapter.setAll(
                projectAdapter.getInitialState(),
                (data.data.listProjects?.items.filter(nonNullable) as Project[]) ?? []
              ),
              errors: data.errors,
            },
          };
        } catch (error) {
          console.error('Could not get project data', error);
          return { error: { status: 500, data: error instanceof Error ? serializeError(error) : error } };
        }
      },
      providesTags: [REPORT_PROJECTS_TAG],
    }),
    updateProject: build.mutation<WithErrorPolicy<UpdateProjectMutation>, { project: UpdateProjectInput }>({
      ...graphQLHelper({ query: ({ project }) => ({ query: updateProject, variables: { input: project } }) }),
      invalidatesTags: (res) => (res?.data?.updateProject?._lastChangedAt ? [REPORT_PROJECTS_TAG] : []),
    }),
    getReportCountries: build.query<string[], string>({
      query: (reportId) => ({
        url: '/report/countries',
        params: {
          reportId,
        },
      }),
    }),
    getFilteredReport: build.query<
      DashboardData | null,
      { reportId: string | null; orgId: string | null; dus: string[] | null }
    >({
      queryFn: async ({ reportId, orgId, dus }) => {
        if (!reportId || !orgId || !dus || (dus && dus.length === 0)) {
          return { data: null };
        }

        try {
          const resp = await API.post('filterParseApi', '/filter-parse', {
            headers: {
              'Content-Type': 'application/json',
            },
            body: { reportId, orgId, dus },
            response: true,
          });

          if (resp.status < 400) {
            return { data: resp.data as DashboardData };
          } else {
            // probably won't get here because network errors appear to be thrown
            return { error: { status: resp.status, data: resp.statusText } };
          }
        } catch (err) {
          console.error(err);
          return { error: { status: 500, data: err instanceof Error ? serializeError(err) : err } };
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchReportQuery,
  useFetchReportDataQuery,
  useListReportsQuery,
  useUpdateReportMutation,
  useListAllReportsQuery,
  useListProjectsQuery,
  useLazyListProjectsQuery,
  useListParseResultsQuery,
  useGetParseQuery,
  useLazyListParseResultsQuery,
  useLazyGetParseQuery,
  useLazyListReportsQuery,
  useLazyFetchReportDataQuery,
  useGetReportCountriesQuery,
  useGetFilteredReportQuery,
  useUpdateProjectMutation,
} = dashboardsGraphql;

export const {
  selectAll: selectAllProjects,
  selectById: selectProjectById,
  selectEntities: selectProjectMap,
  selectIds: selectProjectIds,
  selectTotal: selectProjectTotal,
} = projectAdapter.getSelectors();

export const initialState = {
  //Keep this and we will start peeling back these keys above ^
  selectedReportId: ReportState.NOT_SET,
  refReportId: ReportState.NOT_SET,
} as ReportData;

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setSelectedReportId: (state, action: PayloadAction<string>) => {
      state.selectedReportId = action.payload;
    },
    setRefReportId: (state, action: PayloadAction<string>) => {
      state.refReportId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSignedOut, () => initialState);
  },
});

export const { setSelectedReportId, setRefReportId } = reportSlice.actions;

export const selectCurrentReportId = ({ report }: RootState) => report.selectedReportId;
export const selectRefReportId = ({ report }: RootState) => report.refReportId;
export const selectReportName = (data: Report | undefined | null) => data?.reportName ?? null;
export const selectReportDate = (data: Report | undefined | null) => data?.reportDate ?? null;

export const selectCustomProjectsFromReportData = memoizeWithArgs(
  (data: Report | undefined | null) => JSON.parse(data?.customProjects ?? '[]') as CustomProject[]
);

export default reportSlice.reducer;
