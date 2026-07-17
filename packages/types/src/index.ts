export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: unknown;
  timestamp: string;
}

export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum Permission {
  // Projects
  PROJECTS_CREATE = 'projects.create',
  PROJECTS_READ = 'projects.read',
  PROJECTS_UPDATE = 'projects.update',
  PROJECTS_DELETE = 'projects.delete',

  // Settings
  SETTINGS_READ = 'settings.read',
  SETTINGS_UPDATE = 'settings.update',

  // Analytics
  ANALYTICS_READ = 'analytics.read',

  // Messages
  MESSAGES_READ = 'messages.read',
  MESSAGES_REPLY = 'messages.reply',
  MESSAGES_DELETE = 'messages.delete',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission), // Implicitly all, but explicitly mapped
  [UserRole.ADMIN]: Object.values(Permission), // Full access except maybe future root actions
  [UserRole.EDITOR]: [
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_READ,
    Permission.PROJECTS_UPDATE,
    Permission.ANALYTICS_READ,
    Permission.MESSAGES_READ,
    Permission.MESSAGES_REPLY,
  ],
  [UserRole.VIEWER]: [
    Permission.PROJECTS_READ,
    Permission.ANALYTICS_READ,
    Permission.MESSAGES_READ,
  ],
};

export const hasPermission = (role: UserRole | string, permission: Permission): boolean => {
  if (role === UserRole.SUPER_ADMIN) return true;

  const permissions = ROLE_PERMISSIONS[role as UserRole];
  if (!permissions) return false;

  return permissions.includes(permission);
};
