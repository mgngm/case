import type { GroupType } from '@aws-sdk/client-cognito-identity-provider';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from 'src/store';
import { USERS_TAG, USER_CONTEXT_TAG } from 'src/constants/slices';
import { AccessLevel } from 'src/graphql';
import type { ResponseData } from 'src/types/api';
import type { LocalUser } from 'src/types/user';
import { baseApi } from './api';

export type UserResponseData = ResponseData<{
  user?: LocalUser;
}>;

export type UsersResponseData = ResponseData<{
  users: LocalUser[];
}>;

export type UserGroupResponseData = ResponseData<{
  groups: GroupType[];
}>;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query<LocalUser, { userSub: string }>({
      providesTags: (result, err, arg) => (result?.userSub !== '' ? [{ type: USERS_TAG, id: arg.userSub }] : []),
      query: ({ userSub }) => ({ url: `users/${userSub}/`, method: 'GET' }),
      transformResponse: (response: UserResponseData) => response.data?.user ?? { userSub: '', email: '' },
      keepUnusedDataFor: 60 * 60, // 1 hour
    }),
    getUsers: build.query<LocalUser[], { context: string }>({
      providesTags: (result, error, arg) => (result === undefined ? [] : [{ type: USERS_TAG, id: arg.context }]),
      query: ({ context }) => ({ url: 'users/list/', method: 'POST', body: { context } }),
      transformResponse: (response: UsersResponseData) => response.data?.users ?? [],
    }),
    createUser: build.mutation<ResponseData, { email: string; context: string; defaultContext: string }>({
      invalidatesTags: (result, error, arg) => {
        //If the result was OK, invalidate the users list - otherwise don't do that.
        return result?.ok ? [{ type: USERS_TAG, id: arg.context }] : [];
      },
      query: ({ email, context, defaultContext }) => ({
        url: `users/create/`,
        method: 'POST',
        body: { email, context, defaultContext },
      }),
    }),
    deleteUser: build.mutation<ResponseData, { email: string; context: string }>({
      invalidatesTags: (result, error, arg) => {
        //If the result was OK, invalidate the users list - otherwise don't do that.
        return result?.ok ? [{ type: USERS_TAG, id: arg.context }] : [];
      },
      query: ({ email }) => ({
        url: `users/delete/`,
        method: 'POST',
        body: email,
      }),
    }),
    resetUser: build.mutation<ResponseData, { email: string }>({
      query: ({ email }) => ({
        url: `users/reset/`,
        method: 'POST',
        body: email,
      }),
    }),
    getGroups: build.query<GroupType[], { username: string }>({
      query: ({ username }) => ({
        url: `users/groups/list`,
        method: 'POST',
        body: { username },
      }),
      transformResponse: (response: UserGroupResponseData) => response.data?.groups ?? [],
    }),
    addUserToGroup: build.mutation<
      ResponseData,
      { userSub: string; userName: string; groupName: string; context: string }
    >({
      invalidatesTags: (result, error, arg) => (result?.ok ? [{ type: USERS_TAG, id: arg.context }] : []),
      query: ({ userName, userSub, groupName, context }) => ({
        url: `users/${userSub}/groups/`,
        method: 'POST',
        body: { userName, groupName, context },
      }),
    }),
    removeUserFromGroup: build.mutation<
      ResponseData,
      { userSub: string; userName: string; groupName: string; context: string }
    >({
      invalidatesTags: (result, error, arg) => (result?.ok ? [{ type: USERS_TAG, id: arg.context }] : []),
      query: ({ userName, userSub, groupName, context }) => ({
        url: `users/${userSub}/groups/`,
        method: 'DELETE',
        body: { userName, groupName, context },
      }),
    }),
    changeUserContext: build.mutation<
      ResponseData,
      { userSub: string; currentContext: string | undefined; newContext: string }
    >({
      invalidatesTags: (result) => (result?.ok ? [USERS_TAG, USER_CONTEXT_TAG] : []),
      query: ({ userSub, currentContext, newContext }) => ({
        url: `users/${userSub}/context/`,
        method: 'POST',
        body: { currentContext, newContext },
      }),
    }),
    deleteUsersForOrg: build.mutation<ResponseData, { orgId: string }>({
      invalidatesTags: (result) => (result?.ok ? [{ type: USERS_TAG }] : []),
      query: ({ orgId }) => ({
        url: `cleanup/users/`,
        method: 'DELETE',
        body: { orgId },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useResetUserMutation,
  useRemoveUserFromGroupMutation,
  useAddUserToGroupMutation,
  useGetCurrentUserQuery,
  useDeleteUsersForOrgMutation,
  useChangeUserContextMutation,
} = usersApi;

const initialState = {
  currentUserSub: '',
  accessLevel: AccessLevel.ORGANISATION,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetCurrentUser: () => initialState,
    setCurrentUser: (state, { payload }: PayloadAction<string>) => {
      //Ignore stupid erroneous results
      if (payload !== '') {
        state.currentUserSub = payload;
      }
    },
    setUserAccessLevel: (state, { payload }: PayloadAction<AccessLevel>) => {
      state.accessLevel = payload;
    },
    userSignedOut: () => initialState,
  },
});

export const { resetCurrentUser, setCurrentUser, userSignedOut, setUserAccessLevel } = usersSlice.actions;

export const selectCurrentUserSub = (state: RootState) => state.users.currentUserSub;
export const selectUserAccessLevel = (state: RootState) => state.users.accessLevel;

export const selectUserAttribute = (user: LocalUser | undefined, attribute: string) =>
  user?.Attributes?.find((_att) => _att.Name === attribute)?.Value;

export default usersSlice.reducer;
