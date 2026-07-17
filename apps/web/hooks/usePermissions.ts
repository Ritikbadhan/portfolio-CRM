import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRole, Permission, hasPermission } from '@portfolio/types';

export const usePermissions = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const checkRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  return {
    userRole: user?.role as UserRole | undefined,
    checkRole,
    checkPermission,
  };
};
