import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, EntityState } from '@reduxjs/toolkit';
import { memoizeWithArgs } from 'proxy-memoize';
import type { RootState } from 'src/store';
import { ORGANISATION, PARTNER } from 'src/constants/datastore';
import { USER_CONTEXT_TAG } from 'src/constants/slices';
import type { Organisation, Partner } from 'src/graphql';
import { AccessLevel } from 'src/graphql';
import { sortByKey } from 'src/logic/libs/helpers';
import { serializeError } from 'src/logic/libs/json';
import type { ContextMap } from 'src/models';
import { baseApi, getAuthHeader } from 'src/slices/api';
import { userSignedOut } from 'src/slices/users';
import type { ResponseData } from 'src/types/api';
import type { ContextState } from 'src/types/context';

export type ContextEntityState = {
  accessLevel: AccessLevel;
  [ORGANISATION]: EntityState<Organisation>;
  [PARTNER]: EntityState<Partner>;
};

export type FormattedContext = {
  name: string;
  value: string;
  partnerName: string;
  id: string;
};

export const partnerAdapter = createEntityAdapter<Partner>({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

export const orgAdapter = createEntityAdapter<Organisation>({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

// Define the initial state using that type
const initialState: ContextState = {
  userContext: '',
  reportContext: '',
  adminContext: '',
};

export type IdpContextResponse = ResponseData<{
  context: ContextMap;
}>;

export const contextApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserContext: build.query<ContextEntityState, { userSub: string }>({
      providesTags: [USER_CONTEXT_TAG], //change this as we will only ever be logged in as one user.
      queryFn: async ({ userSub }) => {
        try {
          const res = await fetch(`/api/users/${userSub}/context/`, {
            method: 'GET',
            headers: new Headers({
              'content-type': 'application/json',
              authorization: await getAuthHeader(),
            }),
          });

          const formattedRes = await res.json();

          return {
            data: {
              accessLevel: formattedRes?.data.accessLevel ?? AccessLevel.ORGANISATION,
              [ORGANISATION]: formattedRes?.data[ORGANISATION] ?? orgAdapter.getInitialState(),
              [PARTNER]: formattedRes?.data[PARTNER] ?? partnerAdapter.getInitialState(),
            },
          };
        } catch (err) {
          console.error('Error fetching user contexts...', err);

          return {
            error: { status: 500, data: err instanceof Error ? serializeError(err) : err },
          };
        }
      },
      keepUnusedDataFor: 60 * 60, // 1 hour
    }),
    getIdpContext: build.query<ContextMap, { idp: string }>({
      query: ({ idp }) => ({
        url: `context/idp/`,
        method: 'POST',
        body: { idp },
      }),
      transformResponse: (response: IdpContextResponse) => response.data?.context ?? ({} as ContextMap),
      keepUnusedDataFor: 60 * 60, // 1 hour
    }),
  }),
  overrideExisting: true,
});

export const {
  selectAll: selectAllPartners,
  selectById: selectPartnerById,
  selectEntities: selectPartnerEntities,
  selectIds: selectPartnerIds,
} = partnerAdapter.getSelectors();

export const {
  selectAll: selectAllOrgs,
  selectById: selectOrgById,
  selectEntities: selectOrgEntities,
  selectIds: selectOrgIds,
} = orgAdapter.getSelectors();

export const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setUserContext: (state, action: PayloadAction<string>) => {
      state.userContext = action.payload;
    },
    setReportContext: (state, action: PayloadAction<string>) => {
      state.reportContext = action.payload;
    },
    setAdminContext: (state, action: PayloadAction<string>) => {
      state.adminContext = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSignedOut, () => initialState);
  },
});

export const { useGetUserContextQuery, useLazyGetUserContextQuery } = contextApi;

export const { setUserContext, setReportContext, setAdminContext } = contextSlice.actions;

//Search org then partner contexts for matching ID.
export const searchContexts = (data: ContextEntityState, contextId: string) => {
  //Search org level contexts first;
  let orgContext = selectOrgById(data[ORGANISATION], contextId);
  if (!orgContext) {
    //backwards compatability with old ids (mainly for auto context on login)
    const allOrgs = selectAllOrgs(data[ORGANISATION]);
    orgContext = allOrgs.find((_org) => _org.organisationId === contextId);
    //If we still can't find it, look in our partners.
    if (!orgContext) {
      let partnerContext = selectPartnerById(data[PARTNER], contextId);
      if (!partnerContext) {
        const allPartners = selectAllPartners(data[PARTNER]);
        partnerContext = allPartners.find((_partner) => _partner.partnerId === contextId);
        return partnerContext;
      }
    }
  }

  return orgContext;
};

export const selectUserContextId = (state: RootState) => state.context.userContext;
export const selectReportContextId = (state: RootState) => state.context.reportContext;
export const selectAdminContextId = (state: RootState) => state.context.adminContext;

const sortContexts = (a?: FormattedContext, b?: FormattedContext) => (a && b && sortByKey('name', 'asc')(a, b)) ?? 0;

const extractContextInfo = (availableContexts: ContextEntityState) => (ctx: Partner | Organisation) => {
  if (ctx && availableContexts) {
    return {
      id: ctx.id,
      value: ctx.id,
      name: ('partnerName' in ctx
        ? `${ctx.partnerName} (Partner)`
        : ('organisationName' in ctx && ctx.organisationName) ?? 'N/A') as string,
      partnerName: ('partnerName' in ctx
        ? ctx.partnerName
        : ('partnerOrganisationsId' in ctx &&
            selectPartnerById(availableContexts[PARTNER], ctx.partnerOrganisationsId ?? '')?.partnerName) ??
          'N/A') as string,
    } as FormattedContext;
  }
};

export const selectAllContexts = memoizeWithArgs((availableContexts: ContextEntityState) => [
  //Can put partners at top or bottom of list
  ...selectAllOrgs(availableContexts[ORGANISATION])
    .map(extractContextInfo(availableContexts))
    .filter(Boolean)
    .sort(sortContexts),
  ...selectAllPartners(availableContexts[PARTNER])
    .map(extractContextInfo(availableContexts))
    .filter(Boolean)
    .sort(sortContexts),
]);

export const selectAvailableOrgLevelContexts = memoizeWithArgs((data: ContextEntityState) => {
  if (data && data[ORGANISATION]) {
    return selectAllOrgs(data[ORGANISATION])
      ?.map((ctx) => {
        return {
          value: ctx.id,
          name: ctx.organisationName,
          partnerName:
            selectPartnerById(data[PARTNER], (ctx.partnerOrganisationsId as string) ?? '')?.partnerName ?? 'N/A',
        } as FormattedContext;
      })
      .filter(Boolean)
      .sort(sortContexts);
  } else {
    return [];
  }
});

export const selectAvailableOrgLevelContextsForGivenPartner = memoizeWithArgs(
  (availableContexts?: ContextEntityState, partner?: string) =>
    (availableContexts &&
      partner &&
      selectAllOrgs(availableContexts[ORGANISATION])
        ?.map((ctx) => {
          if (ctx && ctx.partnerOrganisationsId === partner) {
            return {
              value: ctx.id,
              name: ctx.organisationName,
              partnerName: selectPartnerById(availableContexts[PARTNER], partner)?.partnerName ?? 'N/A',
            } as FormattedContext;
          }
        })
        .filter(Boolean)
        .sort(sortContexts)) ||
    []
);

export const selectAvailablePartnersIDs = memoizeWithArgs(
  (availableContexts?: ContextEntityState) =>
    availableContexts &&
    (selectAllPartners(availableContexts[PARTNER])
      ?.map((ctx) => {
        if (ctx) {
          return ctx.id;
        }
      })
      .filter(Boolean) as string[])
);

export const selectAvailablePartners = memoizeWithArgs(
  (availableContexts?: ContextEntityState) =>
    availableContexts &&
    (selectAllPartners(availableContexts[PARTNER])
      ?.map((ctx) => {
        if (ctx) {
          return ctx;
        }
      })
      .filter(Boolean) as Partner[])
);

export const selectOrgsForPartner = memoizeWithArgs((availableContexts: ContextEntityState, partnerId?: string) =>
  availableContexts && partnerId
    ? (selectAllOrgs(availableContexts[ORGANISATION])
        ?.map((ctx) => {
          if (ctx.partnerOrganisationsId === partnerId) {
            return ctx;
          }
        })
        .filter(Boolean) as Organisation[])
    : []
);

export const selectOrgIdsForPartner = memoizeWithArgs((availableContexts: ContextEntityState, partnerId?: string) =>
  availableContexts && partnerId
    ? (selectAllOrgs(availableContexts[ORGANISATION])
        ?.map((ctx) => {
          if (ctx.partnerOrganisationsId === partnerId) {
            return ctx.id;
          }
        })
        .filter(Boolean) as string[])
    : []
);

export const selectPrettyId = memoizeWithArgs((availableContexts?: ContextEntityState, id?: string) =>
  availableContexts && id
    ? selectOrgById(availableContexts[ORGANISATION], id)?.organisationId ??
      selectPartnerById(availableContexts[PARTNER], id)?.partnerId ??
      undefined
    : undefined
);

/**
 * Searches for a given users home context - FOR USE WITH EDITING USER CONTEXT - so NO SSO/GLOBAL MOFOS
 * Logic is as follows
 *
 * - If a user has more than one partner available to them, they must be a global user - so they wouldn't be here anyway.
 * - If a user has more than one ORG available, they must be a partner level user, so return the partner context
 * - If a user only has one org available to them, they're org level, just return that.
 */
export const selectGivenUserHomeContext = memoizeWithArgs((availableContexts?: ContextEntityState) => {
  let returnContext = null;
  if (availableContexts) {
    if (availableContexts[ORGANISATION].ids.length > 1) {
      returnContext = selectPartnerById(availableContexts[PARTNER], availableContexts[PARTNER].ids[0]); //Grab the first partner in the list (there will only be one as SSO won't get here.)
    } else if (availableContexts[ORGANISATION].ids.length === 1) {
      returnContext = selectOrgById(availableContexts[ORGANISATION], availableContexts[ORGANISATION].ids[0]);
    }
  }

  return returnContext;
});

export default contextSlice.reducer;
