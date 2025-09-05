import { getCurrentUser } from './session';

export type UserRole = 'USER' | 'ADMIN' | 'SELLER';

export async function checkRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === requiredRole;
}

export async function checkAnyRole(requiredRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role as UserRole);
}

export async function isAdmin(): Promise<boolean> {
  return checkRole('ADMIN');
}

export async function isSeller(): Promise<boolean> {
  return checkRole('SELLER');
}

export async function isUser(): Promise<boolean> {
  return checkRole('USER');
}

export async function hasAdminAccess(): Promise<boolean> {
  return checkRole('ADMIN');
}

export async function hasSellerAccess(): Promise<boolean> {
  return checkAnyRole(['ADMIN', 'SELLER']);
}

export async function hasUserAccess(): Promise<boolean> {
  return checkAnyRole(['USER', 'ADMIN', 'SELLER']);
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';
    case 'SELLER':
      return 'Seller';
    case 'USER':
      return 'User';
    default:
      return 'Unknown';
  }
}

export function getRolePermissions(role: UserRole): string[] {
  switch (role) {
    case 'ADMIN':
      return ['manage_users', 'manage_products', 'view_analytics', 'manage_system'];
    case 'SELLER':
      return ['manage_own_products', 'view_own_analytics', 'manage_orders'];
    case 'USER':
      return ['view_products', 'make_purchases', 'manage_profile'];
    default:
      return [];
  }
}
