import type { EntityState } from '@reduxjs/toolkit';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { getMonth } from 'date-fns';
import { memoizeWithArgs } from 'proxy-memoize';
import { DU_LIST_TAG } from 'src/constants/slices';
import type { DU, ModelDUFilterInput } from 'src/graphql';
import { duWithProjectsByReport } from 'src/graphql/custom-queries';
import { duByName } from 'src/graphql/queries';
import type { WithErrorPolicy } from 'src/logic/client/graphql/error';
import { nonNullable, sortByKey } from 'src/logic/libs/helpers';
import { baseApi } from 'src/slices/api';
import { graphQLHelper } from 'src/slices/graphql';

export const duAdapter = createEntityAdapter<DU>();

export const duGraphql = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listDUsByReport: build.query<
      WithErrorPolicy<EntityState<DU>>,
      { reportId: string; searchFilter: string; filter?: ModelDUFilterInput }
    >({
      ...graphQLHelper({
        query: ({ reportId, searchFilter = '', filter }) => ({
          query: duWithProjectsByReport,
          variables: {
            reportId,
            filter: { ...filter }, //name: { contains: searchFilter }
          },
        }),
        transformResponse: ({ data, errors }) => ({
          data: duAdapter.setAll(
            duAdapter.getInitialState(),
            (data?.duByReportId?.items?.filter(nonNullable) as DU[]) ?? []
          ),
          errors,
        }),
      }),
      providesTags: (res, err, arg) => [{ type: DU_LIST_TAG, id: arg.reportId }],
    }),
    getDuByNameAndReport: build.query<
      WithErrorPolicy<DU[]>,
      { name: string; reportId: string; filter?: ModelDUFilterInput }
    >({
      ...graphQLHelper({
        query: ({ name, reportId, filter }) => ({
          query: duByName,
          variables: {
            name,
            filter: { ...filter, reportId: { eq: reportId } },
          },
        }),
        transformResponse: ({ data, errors }) => ({
          data: (data?.duByName?.items?.filter(nonNullable) as DU[]) ?? [],
          errors,
        }),
      }),
    }),
    getDuByNameAndContext: build.query<
      WithErrorPolicy<DU[]>,
      { name: string; context: string; filter?: ModelDUFilterInput } //context is pretty id
    >({
      ...graphQLHelper({
        query: ({ name, context, filter }) => ({
          query: duByName,
          variables: {
            name,
            filter: { ...filter, context: { eq: context } },
          },
        }),
        transformResponse: ({ data, errors }) => ({
          data: (data?.duByName?.items?.filter(nonNullable).sort(sortByKey('createdAt', 'desc')) as DU[]) ?? [],
          errors,
        }),
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useListDUsByReportQuery, useGetDuByNameAndReportQuery, useGetDuByNameAndContextQuery } = duGraphql;

export const {
  selectAll: selectAllDUs,
  selectById: selectDUById,
  selectEntities: selectDUMap,
  selectIds: selectDUIds,
  selectTotal: selectDUTotal,
} = duAdapter.getSelectors();

export type FormattedDUHXScore = {
  remoteHX: number;
  officeHX: number;
  overallHX: number;
  month: number;
  _createdAt: string; //for debugging purposes if I need to compare values.
};

export const selectFiveMostRecentHXScores = memoizeWithArgs((DUS: DU[]) => {
  //The query auto-sorts these so we will assume they are already sorted..
  const fiveDUs = DUS.slice(0, 5);

  /** Leave for Debugging */
  // let fiveDUs: DU[] = [];
  // if (DUS[0]) {
  //   fiveDUs = [DUS[0]];
  // }

  return fiveDUs
    .map(
      (_du): FormattedDUHXScore => ({
        remoteHX: _du.remoteHx ?? 0,
        officeHX: _du.officeHx ?? 0,
        overallHX: _du.hxScore ?? 0,
        month: getMonth(new Date(_du.createdAt)),
        _createdAt: _du.createdAt,
      })
    )
    .reverse();
});
