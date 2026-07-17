'use client';

import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '../../store';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      // Redirect to login, optionally passing the return url
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, router, pathname]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
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
