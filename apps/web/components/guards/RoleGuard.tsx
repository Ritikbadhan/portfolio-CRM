'use client';

import { ReactNode } from 'react';
import { UserRole } from '@portfolio/types';
import { usePermissions } from '../../hooks/usePermissions';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { checkRole } = usePermissions();

  if (!checkRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
