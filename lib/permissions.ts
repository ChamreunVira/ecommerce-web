import { User } from "@/types/user";

/**
 * Checks if a user has a specific permission or is a full ROLE_ADMIN
 */
export function hasPermission(user: Partial<User> | null | undefined, requiredPermission: string): boolean {
  if (!user) return false;
  if (user.roles?.includes("ROLE_ADMIN")) return true;
  if (!requiredPermission) return true;
  return Boolean(user.permissions?.includes(requiredPermission));
}

/**
 * Checks if a user has any permission in a given list or is ROLE_ADMIN
 */
export function hasAnyPermission(user: Partial<User> | null | undefined, requiredPermissions: string[]): boolean {
  if (!user) return false;
  if (user.roles?.includes("ROLE_ADMIN")) return true;
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return requiredPermissions.some(perm => user.permissions?.includes(perm));
}

/**
 * Checks if user has a specific role name
 */
export function hasRole(user: Partial<User> | null | undefined, roleName: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(roleName) || user.roles.includes(`ROLE_${roleName}`);
}
