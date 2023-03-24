import type { EntityId, EntityState } from '@reduxjs/toolkit';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { Storage } from 'aws-amplify';
import { memoizeWithArgs } from 'proxy-memoize';
import { INSIGHT_TAG } from 'src/constants/slices';
import type {
  DeleteProjectInsightInput,
  DeleteProjectInsightMutation,
  ListProjectInsightsQuery,
  ListProjectInsightsQueryVariables,
  ProjectInsightByContextQueryVariables,
  UpdateProjectInsightMutation,
} from 'src/graphql';
import {
  createProjectInsight as createProjectInsightMutation,
  deleteProjectInsight,
  updateProjectInsight as updateProjectInsightMutation,
} from 'src/graphql/mutations';
import { listProjectInsights, projectInsightByContext } from 'src/graphql/queries';
import { graphQL } from 'src/logic/client/graphql';
import type { WithErrorPolicy } from 'src/logic/client/graphql/error';
import type { ItemFromPaginatedQuery } from 'src/logic/client/graphql/types';
import { isNotDeleted, nonNullable } from 'src/logic/libs/helpers';
import { createAppAsyncThunk } from 'src/slices';
import { baseApi } from 'src/slices/api';
import { graphQLHelper } from 'src/slices/graphql';
import type { PickPartial } from 'src/types/util';

export type Insight = NonNullable<ItemFromPaginatedQuery<ListProjectInsightsQuery>>;

export const insightAdapter = createEntityAdapter<Insight>();

export const insightsApi = baseApi.enhanceEndpoints({ addTagTypes: [INSIGHT_TAG] }).injectEndpoints({
  endpoints: (build) => ({
    listProjectInsights: build.query<WithErrorPolicy<EntityState<Insight>>, ListProjectInsightsQueryVariables>({
      ...graphQLHelper({
        query: (variables) => ({ query: listProjectInsights, variables }),
        transformResponse: ({ data, errors }) => ({
          data: insightAdapter.setAll(
            insightAdapter.getInitialState(),
            data.listProjectInsights?.items.filter(isNotDeleted) ?? []
          ),
          errors,
        }),
      }),
      providesTags: (data) => [
        { id: 'LIST', type: INSIGHT_TAG },
        ...(data?.data?.ids.map((id) => ({ id, type: INSIGHT_TAG } as const)) ?? []),
      ],
    }),
    listProjectInsightsByContext: build.query<
      WithErrorPolicy<EntityState<Insight>>,
      ProjectInsightByContextQueryVariables
    >({
      ...graphQLHelper({
        query: (variables) => ({ query: projectInsightByContext, variables }),
        transformResponse: ({ data, errors }) => ({
          data: insightAdapter.setAll(
            insightAdapter.getInitialState(),
            data.projectInsightByContext?.items.filter(isNotDeleted) ?? []
          ),
          errors,
        }),
      }),
      providesTags: (data) => [
        { id: 'LIST', type: INSIGHT_TAG },
        ...(data?.data?.ids.map((id) => ({ id, type: INSIGHT_TAG } as const)) ?? []),
      ],
    }),
    deleteProjectInsight: build.mutation<WithErrorPolicy<DeleteProjectInsightMutation>, DeleteProjectInsightInput>({
      ...graphQLHelper({ query: (input) => ({ query: deleteProjectInsight, variables: { input } }) }),
      invalidatesTags: (res, err, arg) => [{ id: arg.id, type: INSIGHT_TAG }],
    }),
  }),
  overrideExisting: true,
});

export const { useListProjectInsightsQuery, useListProjectInsightsByContextQuery, useDeleteProjectInsightMutation } =
  insightsApi;

export const {
  selectAll: selectAllInsights,
  selectById: selectInsightById,
  selectEntities: selectInsightsMap,
  selectIds: selectInsightIds,
  selectTotal: selectInsightsTotal,
} = insightAdapter.getSelectors();

export const selectInsightsByIds = memoizeWithArgs((state: EntityState<Insight>, ids: EntityId[]) =>
  ids.map((id) => selectInsightsMap(state)[id]).filter(nonNullable)
);

type CreateVars = { name: string; date: string; file: File; formattedOrgId: string };

export const createProjectInsight = createAppAsyncThunk(
  'insights/createProjectInsight',
  async ({ name, date, file, formattedOrgId }: CreateVars, { dispatch, rejectWithValue, requestId }) => {
    try {
      const { key } = await Storage.put(`upload/${formattedOrgId}/insights/${requestId}-${file.name}`, file, {
        contentType: file.type,
      });
      const { data, errors } = await graphQL({
        query: createProjectInsightMutation,
        variables: {
          input: {
            name,
            insightDate: date,
            s3Key: key,
            context: formattedOrgId,
            fileName: file.name,
          },
        },
      });
      if (errors) {
        throw rejectWithValue(errors);
      }
      dispatch(insightsApi.util.invalidateTags([{ type: INSIGHT_TAG, id: 'LIST' }]));
      return data;
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const updateProjectInsight = createAppAsyncThunk(
  'insights/updateProjectInsight',
  async (
    {
      id,
      _version,
      name,
      date,
      file,
      s3Key,
      fileName,
      formattedOrgId,
    }: Pick<Insight, 'id' | '_version' | 's3Key' | 'fileName'> & PickPartial<CreateVars, 'file'>,
    { dispatch, rejectWithValue, requestId }
  ): Promise<UpdateProjectInsightMutation | undefined> => {
    try {
      if (file) {
        const oldKey = s3Key;
        ({ key: s3Key } = await Storage.put(`upload/${formattedOrgId}/insights/${requestId}-${file.name}`, file, {
          contentType: file.type,
        }));
        if (oldKey) {
          await Storage.remove(oldKey);
        }
      }
      const { data, errors } = await graphQL({
        query: updateProjectInsightMutation,
        variables: {
          input: {
            id,
            _version,
            name,
            insightDate: date,
            s3Key,
            context: formattedOrgId,
            fileName: file?.name ?? fileName,
          },
        },
      });
      if (errors) {
        throw rejectWithValue(errors);
      }
      dispatch(insightsApi.util.invalidateTags([{ type: INSIGHT_TAG, id }]));
      return data;
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);
