import { createSlice } from '@reduxjs/toolkit';
import { ORGANISATIONS_TAG, PARTNERS_TAG, USER_CONTEXT_TAG } from 'src/constants/slices';
import type {
  Organisation,
  UpdateOrganisationMutation,
  DeleteOrganisationMutation,
  CreateOrganisationMutation,
  Partner,
} from 'src/graphql';
import { ContextStatus } from 'src/graphql';
import { listPartnersAndOrganisations } from 'src/graphql/custom-queries';
import { createOrganisation, deleteOrganisation, updateOrganisation } from 'src/graphql/mutations';
import { organisationByOrganisationId } from 'src/graphql/queries';
import type { WithErrorPolicy } from 'src/logic/client/graphql/error';
import { isNotDeleted } from 'src/logic/libs/helpers';
import { baseApi } from 'src/slices/api';
import { graphQLHelper } from 'src/slices/graphql';
import type { ResponseData } from 'src/types/api';

export const organisationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listOrganisationsByPartner: build.query<WithErrorPolicy<Organisation[]>, { partnerId: string }>({
      providesTags: [ORGANISATIONS_TAG],
      ...graphQLHelper({
        query: ({ partnerId }) => ({
          query: listPartnersAndOrganisations,
          variables: { filter: { partnerId: { eq: partnerId } } },
        }),
        transformResponse: ({ data, errors }) => ({
          data: data.listPartners?.items.filter(isNotDeleted)[0].organisations?.items?.filter(isNotDeleted) ?? [],
          errors,
        }),
      }),
    }),
    getOrganisation: build.query<WithErrorPolicy<Organisation | null>, { organisationId: string }>({
      providesTags: (result) => [{ type: ORGANISATIONS_TAG, id: result?.data?.id }],
      ...graphQLHelper({
        query: ({ organisationId }) => ({ query: organisationByOrganisationId, variables: { organisationId } }),
        transformResponse: (response) => {
          const { data, errors } = response;
          const orgs = data.organisationByOrganisationId?.items;

          //filter deleted orgs and sort them by last edited (just in case you have a duplicate as we did during developement...)
          if (orgs && orgs.length > 0) {
            const filteredOrgs = orgs.filter(isNotDeleted);
            const sortedOrgs = filteredOrgs.sort((a, b) => (a?._lastChangedAt || 0) - (b?._lastChangedAt || 0));
            return { data: sortedOrgs[0], errors };
          }

          return { data: null, errors };
        },
      }),
    }),
    createOrganisation: build.mutation<
      WithErrorPolicy<CreateOrganisationMutation>,
      { name: string; organisationId: string; partner: Partner }
    >({
      invalidatesTags: [ORGANISATIONS_TAG, PARTNERS_TAG, USER_CONTEXT_TAG],
      ...graphQLHelper({
        query: ({ name, organisationId, partner }) => ({
          query: createOrganisation,
          variables: {
            input: {
              organisationName: name,
              organisationId: `${partner.partnerId}/${organisationId}`,
              partnerOrganisationsId: partner.id,
              status: ContextStatus.CREATED,
            },
          },
        }),
      }),
    }),
    editOrganisation: build.mutation<
      WithErrorPolicy<UpdateOrganisationMutation>,
      { id: string; name: string; _version: number }
    >({
      invalidatesTags: [ORGANISATIONS_TAG, PARTNERS_TAG, USER_CONTEXT_TAG],
      ...graphQLHelper({
        query: ({ name, id, _version }) => ({
          query: updateOrganisation,
          variables: { input: { organisationName: name, id, _version } },
        }),
      }),
    }),
    deleteOrganisation: build.mutation<WithErrorPolicy<DeleteOrganisationMutation>, { id: string; _version: number }>({
      invalidatesTags: [ORGANISATIONS_TAG, PARTNERS_TAG, USER_CONTEXT_TAG],
      ...graphQLHelper({
        query: ({ id, _version }) => ({ query: deleteOrganisation, variables: { input: { id, _version } } }),
      }),
    }),
    deleteOrgGroup: build.mutation<ResponseData, { id: string }>({
      // invalidatesTags: (result, error, arg) => (result?.ok ? [{ type: USERS_TAG, id: arg.context }] : []), //TODO: Think about what tags I would invalidate here.
      query: ({ id }) => ({
        url: `cleanup/groups/`,
        method: 'DELETE',
        body: { id },
      }),
    }),
    deletePartnerGroup: build.mutation<ResponseData, { id: string }>({
      // invalidatesTags: (result, error, arg) => (result?.ok ? [{ type: USERS_TAG, id: arg.context }] : []), //TODO: Think about what tags I would invalidate here.
      query: ({ id }) => ({
        url: `cleanup/groups/`,
        method: 'DELETE',
        body: { id, partnerLevel: true },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useListOrganisationsByPartnerQuery,
  useGetOrganisationQuery,
  useCreateOrganisationMutation,
  useEditOrganisationMutation,
  useDeleteOrganisationMutation,
  useDeleteOrgGroupMutation,
  useDeletePartnerGroupMutation,
} = organisationsApi;

const organisationsSlice = createSlice({
  name: 'organisations',
  initialState: [],
  reducers: {},
});

export default organisationsSlice.reducer;
