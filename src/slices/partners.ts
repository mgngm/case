import { ORGANISATIONS_TAG, PARTNERS_TAG, USER_CONTEXT_TAG } from 'src/constants/slices';
import type {
  CreatePartnerMutation,
  DeletePartnerMutation,
  GetPartnerQuery,
  Partner,
  UpdatePartnerMutation,
  ListPartnersAndOrganisationsQueryVariables,
} from 'src/graphql';
import { ContextStatus } from 'src/graphql';
import { listPartnersAndOrganisations } from 'src/graphql/custom-queries';
import { createPartner, deletePartner, updatePartner } from 'src/graphql/mutations';
import { partnerByPartnerId } from 'src/graphql/queries';
import type { WithErrorPolicy } from 'src/logic/client/graphql/error';
import { isNotDeleted } from 'src/logic/libs/helpers';
import { baseApi } from 'src/slices/api';
import { graphQLHelper } from 'src/slices/graphql';

export const partnersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPartners: build.query<WithErrorPolicy<Partner[]>, ListPartnersAndOrganisationsQueryVariables>({
      ...graphQLHelper({
        query: (variables) => ({ query: listPartnersAndOrganisations, variables }),
        transformResponse: ({ data, errors }) => {
          // filter out deleted partners
          const partners = data.listPartners?.items.filter(isNotDeleted) ?? [];

          // filter out deleted organisations
          partners.forEach((p) => {
            if (p.organisations?.items) {
              p.organisations.items = p.organisations?.items.filter(isNotDeleted);
            }
          });

          return { data: partners, errors };
        },
      }),
      providesTags: [PARTNERS_TAG, ORGANISATIONS_TAG],
    }),
    getPartner: build.query<WithErrorPolicy<GetPartnerQuery>, { partnerId: string }>({
      providesTags: (result) => [{ type: PARTNERS_TAG, id: result?.data?.getPartner?.id }],
      ...graphQLHelper({ query: ({ partnerId }) => ({ query: partnerByPartnerId, variables: { partnerId } }) }),
    }),
    createPartner: build.mutation<WithErrorPolicy<CreatePartnerMutation>, { name: string; partnerId: string }>({
      invalidatesTags: (result) => (result?.data?.createPartner?.createdAt ? [PARTNERS_TAG, USER_CONTEXT_TAG] : []),
      ...graphQLHelper({
        query: ({ name, partnerId }) => ({
          query: createPartner,
          variables: { input: { partnerName: name, partnerId, status: ContextStatus.CREATED } },
        }),
      }),
    }),
    editPartner: build.mutation<WithErrorPolicy<UpdatePartnerMutation>, { id: string; name: string; _version: number }>(
      {
        invalidatesTags: (result) => (result?.data?.updatePartner?.updatedAt ? [PARTNERS_TAG, USER_CONTEXT_TAG] : []),
        ...graphQLHelper({
          query: ({ name, id, _version }) => ({
            query: updatePartner,
            variables: { input: { partnerName: name, id, _version } },
          }),
        }),
      }
    ),
    deletePartner: build.mutation<WithErrorPolicy<DeletePartnerMutation>, { id: string; _version: number }>({
      invalidatesTags: [PARTNERS_TAG, ORGANISATIONS_TAG, USER_CONTEXT_TAG],
      ...graphQLHelper({
        query: ({ id, _version }) => ({ query: deletePartner, variables: { input: { id, _version } } }),
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useListPartnersQuery,
  useGetPartnerQuery,
  useCreatePartnerMutation,
  useEditPartnerMutation,
  useDeletePartnerMutation,
} = partnersApi;
