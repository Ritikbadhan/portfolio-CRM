import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setCredentials, clearCredentials } from './authSlice';

// API base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers) => {
    // If we were using localstorage for tokens we'd attach them here,
    // but we use HTTP-only cookies, so the browser handles it!
    return headers;
  },
});

// Wrapper to handle automatic refresh on 401s
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to get a new token via refresh endpoint
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // Retry the original query with the new cookies
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Force logout if refresh fails
      api.dispatch(clearCredentials());
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (error) {
          // Handled at component level
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (error) {
          // Handled at component level
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
        } catch (error) {
          dispatch(clearCredentials()); // Clear anyway on frontend
        }
      },
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (error) {
          dispatch(clearCredentials());
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (error) {
          // Handle in component
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/auth/updatedetails',
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data }));
        } catch (error) {
          // Handled at component level
        }
      },
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/updatepassword',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
