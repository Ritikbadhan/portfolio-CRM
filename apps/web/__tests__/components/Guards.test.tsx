import { render, screen } from '@testing-library/react';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { UserRole, Permission } from '@portfolio/types';
import * as usePermissionsModule from '../../hooks/usePermissions';

jest.mock('../../hooks/usePermissions');

describe('RBAC Guards Components', () => {
  describe('RoleGuard', () => {
    it('should render children if user has the allowed role', () => {
      jest.spyOn(usePermissionsModule, 'usePermissions').mockReturnValue({
        userRole: UserRole.ADMIN,
        checkRole: jest.fn().mockReturnValue(true),
        checkPermission: jest.fn(),
      });

      render(
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
          <div data-testid="protected-content">Secret Content</div>
        </RoleGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should render fallback if user lacks the allowed role', () => {
      jest.spyOn(usePermissionsModule, 'usePermissions').mockReturnValue({
        userRole: UserRole.VIEWER,
        checkRole: jest.fn().mockReturnValue(false),
        checkPermission: jest.fn(),
      });

      render(
        <RoleGuard
          allowedRoles={[UserRole.ADMIN]}
          fallback={<div data-testid="fallback">Access Denied</div>}
        >
          <div data-testid="protected-content">Secret Content</div>
        </RoleGuard>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });

  describe('PermissionGuard', () => {
    it('should render children if user has the allowed permission', () => {
      jest.spyOn(usePermissionsModule, 'usePermissions').mockReturnValue({
        userRole: UserRole.EDITOR,
        checkRole: jest.fn(),
        checkPermission: jest.fn().mockReturnValue(true),
      });

      render(
        <PermissionGuard permission={Permission.PROJECTS_CREATE}>
          <button data-testid="create-btn">Create Project</button>
        </PermissionGuard>
      );

      expect(screen.getByTestId('create-btn')).toBeInTheDocument();
    });

    it('should render fallback if user lacks the permission', () => {
      jest.spyOn(usePermissionsModule, 'usePermissions').mockReturnValue({
        userRole: UserRole.VIEWER,
        checkRole: jest.fn(),
        checkPermission: jest.fn().mockReturnValue(false),
      });

      render(
        <PermissionGuard
          permission={Permission.PROJECTS_CREATE}
          fallback={<div data-testid="fallback">No Create Access</div>}
        >
          <button data-testid="create-btn">Create Project</button>
        </PermissionGuard>
      );

      expect(screen.queryByTestId('create-btn')).not.toBeInTheDocument();
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });
});
