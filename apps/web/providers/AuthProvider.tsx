'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../store/features/auth/authApi';
import { setInitialized } from '../store/features/auth/authSlice';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // This query will automatically fire on mount.
  // Since we use HTTP-only cookies, the browser automatically sends them.
  // If the user has a valid session, this returns the user.
  // If the access token is expired, the authApi baseQuery interceptor automatically tries to refresh it.
  const { isLoading, isUninitialized } = useGetMeQuery(undefined, {
    // Only run this query once on initial app load
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (!isLoading && !isUninitialized) {
      dispatch(setInitialized());
    }
  }, [isLoading, isUninitialized, dispatch]);

  if (isLoading || isUninitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>;
}
