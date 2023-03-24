import { useDebugValue } from 'react';
import { ORGANISATION } from 'src/constants/datastore';
import type { Organisation, Partner } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import {
  searchContexts,
  selectAdminContextId,
  selectOrgById,
  selectReportContextId,
  selectUserContextId,
  useGetUserContextQuery,
} from 'src/slices/context';
import { selectCurrentUserSub } from 'src/slices/users';

type ContextMap = {
  loading: boolean;
  reportContext: {
    id: null | string;
    prettyId: null | string;
    meta: null | Organisation;
  };
  adminContext: {
    id: null | string;
    prettyId: null | string;
    meta: null | Organisation;
  };
  userContext: {
    id: null | string;
    prettyId: null | string;
    meta: null | Organisation | Partner;
  };
};
export default function useContextInfo() {
  const contextMap: ContextMap = {
    loading: false,
    reportContext: {
      id: null,
      prettyId: null,
      meta: null,
    },
    adminContext: {
      id: null,
      prettyId: null,
      meta: null,
    },
    userContext: {
      id: null,
      prettyId: null,
      meta: null,
    },
  };
  const userSub = useAppSelector(selectCurrentUserSub);
  const { contextData, isLoading } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ data, isLoading }) => ({
        contextData: data,
        isLoading,
      }),
    }
  );

  const reportContextId = useAppSelector(selectReportContextId);
  const adminContextId = useAppSelector(selectAdminContextId);
  const userContextId = useAppSelector(selectUserContextId);

  contextMap.loading = isLoading;

  if (contextData) {
    const reportContext = selectOrgById(contextData[ORGANISATION], reportContextId);
    if (reportContext) {
      contextMap.reportContext.meta = reportContext;
      contextMap.reportContext.prettyId = reportContext.organisationId;
      contextMap.reportContext.id = reportContextId;
    }

    const adminContext = selectOrgById(contextData[ORGANISATION], adminContextId);
    if (adminContext) {
      contextMap.adminContext.meta = adminContext;
      contextMap.adminContext.prettyId = adminContext.organisationId;
      contextMap.adminContext.id = adminContextId;
    }

    const userContext = searchContexts(contextData, userContextId);
    if (userContext) {
      contextMap.userContext.meta = userContext;
      // @ts-expect-error not right now.
      contextMap.userContext.prettyId = userContext.organisationId ?? userContext.partnerId;
      contextMap.userContext.id = userContextId;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(contextMap);
  }

  return contextMap;
}
