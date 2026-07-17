'use client';

import { ReactNode } from 'react';
import { Permission } from '@portfolio/types';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGuardProps {
  children: ReactNode;
  permission: Permission;
  fallback?: ReactNode;
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { checkPermission } = usePermissions();

  if (!checkPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
