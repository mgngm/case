import type { Dispatch, SetStateAction } from 'react';
import type { AppThunk } from 'src/store';
import { DeleteType } from 'src/constants/api';
import { ORGANISATION, PARTNER, REPORT } from 'src/constants/datastore';
import { REPORT_LIST_TAG, USER_CONTEXT_TAG } from 'src/constants/slices';
import type { Organisation, Partner, Report } from 'src/graphql';
import { ContextStatus, ReportStatus } from 'src/graphql';
import { deleteContextMap, updateOrganisation, updatePartner, updateReport } from 'src/graphql/mutations';
import { listContextMaps } from 'src/graphql/queries';
import { graphQL } from 'src/logic/client/graphql';
import { baseApi, getAuthHeader } from 'src/slices/api';
import { dashboardsGraphql, selectNewReport } from 'src/slices/report';

type DynamoObject = { id: string; _version: number; _deleted?: boolean | null };

/**
 * Fetches all objects in the contextMapping table to get ids for delete
 * @param {string} orgId
 * @returns list of contextMapping IDs that match the given org string
 */
export const getContextMappingIDsForOrg = async (orgId: string) => {
  const { data: contextMappingData } = await graphQL({
    query: listContextMaps,
    variables: {
      filter: { context: { eq: orgId } },
      limit: 9999,
    },
  });

  const contextItems = (contextMappingData?.listContextMaps?.items as DynamoObject[]) ?? [];
  return contextItems.map<DynamoObject>((_ctx) => ({ id: _ctx.id, _version: _ctx._version }));
};

type ReportDeleteProps = {
  report: Report;
  setLoading: Dispatch<SetStateAction<boolean>>;
  context: string;
  setDialogError: Dispatch<SetStateAction<string | null>>;
  newReport: Report | undefined;
};

/**
 *  This function will mark a report for deletion and pass the report ID to the delete lambda for processing.
 *
 * @param { report } - Report we are deleting
 * @param { setLoading } - Sets the loading flag on the components
 * @param { context } - Admin context so we can invalidate the tag and refetch the list after we're done
 * @returns
 */
export const deleteReport =
  ({ report, setLoading, context, newReport }: ReportDeleteProps): AppThunk<void> =>
  async (dispatch) => {
    setLoading(true);

    try {
      //Mark report now for deletion.
      await graphQL({
        query: updateReport,
        variables: {
          input: {
            id: report.id,
            _version: report._version,
            reportStatus: ReportStatus.FOR_DELETION,
          },
        },
      });
      //Kick tags for client.
      dispatch(dashboardsGraphql.util.invalidateTags([{ type: REPORT_LIST_TAG, id: context }]));

      //Trigger API to send queue message to lambda, as we need to delete other things than _just_ the report.
      await fetch('/api/delete', {
        method: 'POST',
        body: JSON.stringify({ id: report.id, type: REPORT }),
        headers: new Headers({
          authorization: await getAuthHeader(),
          'content-type': 'application/json',
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      // Set new report if needed.
      if (newReport) {
        dispatch(selectNewReport({ reportId: newReport.id, context: newReport.context as string }));
      }
      setLoading(false);
    }
  };

type ContextDeleteProps = {
  context: Partner | Organisation;
  id: string;
  deleteType: DeleteType;
};
/**
 *  This function will mark a context for deletion (org or partner) and pass the ID to the delete lambda for processing.
 *
 * @param { report } - Report we are deleting
 * @param { setLoading } - Sets the loading flag on the components
 * @param { context } - Admin context so we can invalidate the tag and refetch the list after we're done
 * @returns
 */
export const deleteContext =
  ({ id, deleteType, context }: ContextDeleteProps): AppThunk<void> =>
  async (dispatch) => {
    try {
      //Mark org now for deletion
      await graphQL({
        query: deleteType === DeleteType.organisation ? updateOrganisation : updatePartner,
        variables: {
          input: {
            id: context.id,
            _version: context._version,
            status: ContextStatus.FOR_DELETION,
          },
        },
      });

      const contextMappingId =
        context && 'organisationId' in context
          ? context.organisationId
          : context && 'partnerId' in context
          ? context?.partnerId
          : null;

      //Delete the context mapping here as it's so inconsequential and easy to do.
      if (contextMappingId) {
        const contextIds = await getContextMappingIDsForOrg(contextMappingId);
        for (const _ctxId of contextIds) {
          await graphQL({
            query: deleteContextMap,
            variables: { input: _ctxId },
          });
        }
      }

      //Kick tags for client.
      dispatch(baseApi.util.invalidateTags([USER_CONTEXT_TAG]));

      //Trigger API to send queue message to lambda, as we need to delete other things than _just_ the org.
      await fetch('/api/delete/', {
        method: 'POST',
        body: JSON.stringify({ id: id, type: deleteType === DeleteType.organisation ? ORGANISATION : PARTNER }),
        headers: new Headers({
          authorization: await getAuthHeader(),
          'content-type': 'application/json',
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };
