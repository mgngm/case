import type { AppThunk } from 'src/store';
import { ORGANISATIONS_TAG, REPORT_PROJECTS_TAG, REPORT_TAG, PARSE_LIST_TAG } from 'src/constants/slices';
import type { Parse, Project } from 'src/graphql';
import { ParseStatus } from 'src/graphql';
import {
  selectCustomProjects,
  selectInsights,
  setCustomProjects,
  setPreviewProjects,
  setPreviewReportData,
  setPreviewReportDate,
  setPreviewReportName,
  setInsights,
} from 'src/slices/preview';
import { dashboardsGraphql, selectCustomProjectsFromReportData, selectProjectMap } from 'src/slices/report';
import type { DashboardData } from 'src/types/slices';

type PollStartProps = {
  trigger: (arg: { id: string }, preferCacheValue?: boolean) => { unwrap: () => Promise<{ data: Parse | null }> };
  parseId: string;
  debug?: boolean;
};
export const reportParsePollFn = async ({ trigger, parseId, debug }: PollStartProps): Promise<Parse | null> => {
  try {
    if (debug) {
      console.log('++ Attemping trigger trigger now :- ', parseId, ' ++ ');
    }
    const result = await trigger({ id: parseId }, false).unwrap();

    return result.data ? result.data : null;
  } catch (e) {
    console.log('-- Error in poll trigger --', JSON.stringify(e));
    return null;
  }
};
export const reportParseStatusValidation = ({
  parse,
  desiredStatus,
  debug,
}: {
  parse: Parse;
  desiredStatus: ParseStatus | ParseStatus[];
  debug?: boolean;
}): boolean => {
  if (debug) {
    console.log('++ Validate Parse Started ++ ', parse?.status, desiredStatus);
  }
  if (parse?.status) {
    if (parse.status === ParseStatus.ERROR) {
      throw new Error(
        `Parse failed: ${
          parse.warnings && parse.warnings.length > 0 ? JSON.stringify(parse.warnings) : 'Reason unknown'
        }`
      );
    }

    return typeof desiredStatus === 'string' ? parse.status === desiredStatus : desiredStatus.includes(parse.status);
  } else {
    return false;
  }
};

export const reportParseDuStatusValidation = ({ parse, debug }: { parse: Parse; debug?: boolean }): boolean => {
  if (debug) {
    console.log('++ Validate DU Parse Status Started ++ ', parse.expectedDus, parse.processedDus);
  }
  if (parse && parse.processedDus && parse.expectedDus) {
    return parse.processedDus >= parse.expectedDus;
  } else {
    return false;
  }
};

/**
 * Takes preview data and saves it in preview slice
 *
 * For the preview so far we need 3 things
 *  - Report data
 *  - Projects
 *  - Custom Projects
 */
export const fetchPreviewReportData =
  (
    reportId: string,
    update = false
  ): AppThunk<Promise<{ reportData: DashboardData; projectData: Project[]; reportName: string; reportDate: string }>> =>
  async (dispatch, getState) => {
    const reportPromise = dispatch(
      dashboardsGraphql.endpoints.fetchReport.initiate({ id: reportId }, { forceRefetch: true })
    );

    const reportDataPromise = dispatch(
      dashboardsGraphql.endpoints.fetchReportData.initiate({ id: reportId }, { forceRefetch: true })
    );

    let reportMeta;
    let reportData;
    let projectData: Project[] = [];

    //Fetch available user contexts - we need this to map the info for our default org into state.
    try {
      reportData = (await reportDataPromise.unwrap()).data;

      if (reportData) {
        dispatch(setPreviewReportData(reportData));
      }

      reportMeta = (await reportPromise.unwrap()).data;
      if (reportMeta) {
        dispatch(setPreviewReportName(reportMeta?.reportName ?? 'Unknown'));
        dispatch(setPreviewReportDate(reportMeta?.reportDate ?? new Date().toISOString().split('T')[0]));

        //We want to set the custom projects off of the report meta top level key.
        dispatch(
          setCustomProjects(update ? selectCustomProjects(getState()) : selectCustomProjectsFromReportData(reportMeta))
        );

        //We want our selected insights off of report meta
        dispatch(setInsights(update ? selectInsights(getState()) : (reportMeta.insightIds as string[]) ?? []));

        //We are going to look at all the IDS attached to this report currently, and then grab them from the DB.
        const projectIds = reportMeta.projectIds ?? [];
        const projectsPromise = dispatch(
          dashboardsGraphql.endpoints.listProjects.initiate(
            {
              preview: false,
              filter: {
                and: [{ or: projectIds.map((id) => ({ id: { eq: id } })) }, { reportProjectsId: { eq: reportId } }],
              },
            },
            { forceRefetch: true }
          )
        );
        try {
          //We then set them in preview state, because the listProjects query will return them from that if the preview flag is passed.
          const projectMap = selectProjectMap((await projectsPromise.unwrap()).data);

          //The projects don't come out of the database ordered so we need to do that here.
          const sortedProjects = [];
          for (const _projId of projectIds) {
            const _projData = _projId && projectMap[_projId];
            if (_projData) {
              sortedProjects.push(_projData);
            }
          }

          projectData = sortedProjects;
          if (projectData) {
            dispatch(setPreviewProjects(projectData));
          }
        } finally {
          projectsPromise.unsubscribe();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      // Remove the subscriptions here.
      reportPromise.unsubscribe();
      reportDataPromise.unsubscribe();
    }

    // invalidate tags to kick the queries back into life and refresh preview queries.
    dispatch(
      dashboardsGraphql.util.invalidateTags([REPORT_TAG, REPORT_PROJECTS_TAG, ORGANISATIONS_TAG, PARSE_LIST_TAG])
    );

    return {
      reportData: reportData ?? ({} as DashboardData),
      projectData,
      reportName: reportMeta?.reportName ?? 'Unknown',
      reportDate: reportMeta?.reportDate ?? 'Unknown',
    };
  };
