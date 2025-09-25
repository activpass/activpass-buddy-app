import type { HydratedDocument, Model } from 'mongoose';

import type { IRoleBase, IRoleFilter, IRoleSchema, RoleLevel } from '@/validations/role.validation';

// Type for hierarchy tree node
export interface IRoleHierarchyNode extends IRoleBase {
  _id: string;
  children: IRoleHierarchyNode[];
}

// Mongoose document type with additional virtual properties
export type IRoleDocument = HydratedDocument<IRoleSchema> & {
  _memberCount?: number;
  _effectivePermissionCount?: number;
  memberCount: number;
  effectivePermissionCount: number;
};

// Role instance methods
export interface IRoleSchemaMethods {
  /**
       const role = await (this as IRoleModel).findById(currentId).exec();
    if (!role) return false;

    // Check all parent roles in parallel
    const parentChecks = await Promise.all(
      role.inheritsFrom.map(parentId => checkCircular(parentId, targetId, new Set(visited)))
    );
    
    return parentChecks.some(hasCircular => hasCircular); role has a specific permission
   */
  hasPermission(permissionId: string): boolean;

  /**
   * Get all effective permissions (including inherited)
   */
  getEffectivePermissions(): Promise<string[]>;

  /**
   * Check if role is hierarchically higher than another
   */
  isHigherThan(otherRole: IRoleDocument): boolean;

  /**
   * Add permissions to this role
   */
  addPermissions(permissionIds: string[]): Promise<IRoleDocument>;

  /**
   * Remove permissions from this role
   */
  removePermissions(permissionIds: string[]): Promise<IRoleDocument>;

  /**
   * Add parent roles for inheritance
   */
  addParentRoles(parentRoleIds: string[]): Promise<IRoleDocument>;

  /**
   * Remove parent roles
   */
  removeParentRoles(parentRoleIds: string[]): Promise<IRoleDocument>;

  /**
   * Check if this role can inherit from another role (prevents circular inheritance)
   */
  canInheritFrom(parentRoleId: string): Promise<boolean>;

  /**
   * Get display information
   */
  getDisplayInfo(): {
    name: string;
    level: string;
    permissionCount: number;
    inheritanceChain: string[];
  };
}

// Role static methods
export interface IRoleModel extends Model<IRoleBase, {}, IRoleSchemaMethods> {
  /**
   * Find roles with pagination and filtering
   */
  findWithPagination(filter: IRoleFilter): Promise<{
    roles: IRoleDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  /**
   * Find roles by type
   */
  findByType(type: string): Promise<IRoleDocument[]>;

  /**
   * Find roles by level
   */
  findByLevel(level: RoleLevel): Promise<IRoleDocument[]>;

  /**
   * Find roles with specific permission
   */
  findWithPermission(permissionId: string): Promise<IRoleDocument[]>;

  /**
   * Check if a role key exists
   */
  keyExists(key: string, excludeId?: string): Promise<boolean>;

  /**
   * Get creator role
   */
  getCreatorRole(): Promise<IRoleDocument | null>;

  /**
   * Get default role
   */
  getDefaultRole(): Promise<IRoleDocument | null>;

  /**
   * Set creator role
   */
  setCreatorRole(roleId: string): Promise<void>;

  /**
   * Set default role
   */
  setDefaultRole(roleId: string): Promise<void>;

  /**
   * Find by role key
   */
  findByKey(key: string): Promise<IRoleDocument | null>;

  /**
   * Create default system roles
   */
  createSystemRoles(): Promise<void>;

  /**
   * Get role hierarchy tree
   */
  getHierarchyTree(): Promise<IRoleHierarchyNode[]>;

  /**
   * Validate role hierarchy (check for circular inheritance)
   */
  validateHierarchy(roleId: string, parentIds: string[]): Promise<boolean>;

  /**
   * Get all roles that inherit from a specific role
   */
  findChildRoles(parentRoleId: string): Promise<IRoleDocument[]>;

  /**
   * Update member count for a role
   */
  updateMemberCount(roleId: string, delta: number): Promise<void>;

  /**
   * Bulk assign permissions to roles
   */
  bulkAssignPermissions(
    assignments: Array<{ roleId: string; permissionIds: string[] }>
  ): Promise<void>;
}
