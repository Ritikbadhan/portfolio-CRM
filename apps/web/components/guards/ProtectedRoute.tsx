'use client';

import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '../../store';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { UserRole, Permission } from '@portfolio/types';
import { usePermissions } from '../../hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedPermissions?: Permission[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  allowedPermissions,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  const { checkRole, checkPermission } = usePermissions();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isInitialized && isAuthenticated) {
      if (allowedRoles && !checkRole(allowedRoles)) {
        router.push('/unauthorized');
        return;
      }

      if (allowedPermissions) {
        const hasAllPerms = allowedPermissions.every((p) => checkPermission(p));
        if (!hasAllPerms) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [
    isInitialized,
    isAuthenticated,
    router,
    pathname,
    allowedRoles,
    allowedPermissions,
    checkRole,
    checkPermission,
  ]);

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

  // Double check during render
  if (allowedRoles && !checkRole(allowedRoles)) return null;
  if (allowedPermissions && !allowedPermissions.every((p) => checkPermission(p))) return null;

  return <>{children}</>;
}
