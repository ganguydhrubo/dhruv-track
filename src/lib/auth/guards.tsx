'use client';

import { usePermissions } from '@/lib/auth/hooks';
import type { Permission } from '@/lib/auth/permissions';
import type { RoleName } from '@/lib/types/database';

interface RoleGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  roles?: RoleName[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  permission,
  permissions,
  roles,
  fallback = null,
}: RoleGuardProps) {
  const { role, can, canAny, loading } = usePermissions();

  if (loading) return null;
  if (!role) return <>{fallback}</>;

  // Check specific roles
  if (roles && !roles.includes(role)) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  // Check any of multiple permissions
  if (permissions && !canAny(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
