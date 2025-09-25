import { type IRoleFilter, type IRoleSchema } from '@/validations/role.validation';

import {
  type IRoleCreateInput,
  type IRolePermissionAssignment,
  type IRoleUpdateInput,
} from '../repository/role.repository.types';

export interface IRoleServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IRoleService {
  /**
   * Create a new role with business logic validation
   */
  createRole(data: IRoleCreateInput): Promise<IRoleServiceResponse>;

  /**
   * Get role by ID with related data
   */
  getRoleById(id: string): Promise<IRoleServiceResponse>;

  /**
   * Get role by key
   */
  getRoleByKey(key: string): Promise<IRoleServiceResponse>;

  /**
   * Get all roles with filtering and pagination
   */
  getAllRoles(filter: IRoleFilter): Promise<IRoleServiceResponse<IRoleSchema[]>>;

  /**
   * Update role with validation
   */
  updateRole(id: string, data: IRoleUpdateInput): Promise<IRoleServiceResponse>;

  /**
   * Delete role with dependency checks
   */
  deleteRole(id: string): Promise<IRoleServiceResponse>;

  /**
   * Get roles grouped by type
   */
  getRolesByType(): Promise<IRoleServiceResponse>;

  /**
   * Get roles grouped by level
   */
  getRolesByLevel(): Promise<IRoleServiceResponse>;

  /**
   * Search roles with advanced filters
   */
  searchRoles(query: string, filters?: Partial<IRoleFilter>): Promise<IRoleServiceResponse>;

  /**
   * Initialize system roles
   */
  initializeSystemRoles(): Promise<IRoleServiceResponse>;

  /**
   * Assign permissions to role
   */
  assignPermissionsToRole(assignment: IRolePermissionAssignment): Promise<IRoleServiceResponse>;

  /**
   * Get effective permissions for a role (including inherited)
   */
  getEffectivePermissions(roleId: string): Promise<IRoleServiceResponse>;

  /**
   * Get role hierarchy tree
   */
  getRoleHierarchy(): Promise<IRoleServiceResponse>;

  /**
   * Set role as creator role
   */
  setCreatorRole(roleId: string): Promise<IRoleServiceResponse>;

  /**
   * Set role as default role
   */
  setDefaultRole(roleId: string): Promise<IRoleServiceResponse>;

  /**
   * Get creator role
   */
  getCreatorRole(): Promise<IRoleServiceResponse>;

  /**
   * Get default role
   */
  getDefaultRole(): Promise<IRoleServiceResponse>;

  /**
   * Validate role hierarchy
   */
  validateRoleHierarchy(
    roleId: string,
    parentIds: string[]
  ): Promise<IRoleServiceResponse<boolean>>;

  /**
   * Get role statistics and analytics
   */
  getRoleStats(): Promise<IRoleServiceResponse>;

  /**
   * Bulk assign permissions to multiple roles
   */
  bulkAssignPermissions(assignments: IRolePermissionAssignment[]): Promise<IRoleServiceResponse>;

  /**
   * Export roles to different formats
   */
  exportRoles(format: 'json' | 'csv' | 'excel'): Promise<IRoleServiceResponse>;

  /**
   * Check if user has role
   */
  checkUserRole(userId: string, roleKey: string): Promise<IRoleServiceResponse<boolean>>;

  /**
   * Get suggested roles based on user context
   */
  getSuggestedRoles(context: {
    userLevel?: string;
    department?: string;
    permissions?: string[];
  }): Promise<IRoleServiceResponse>;

  /**
   * Clone role with new name/key
   */
  cloneRole(
    sourceRoleId: string,
    newRoleData: { name: string; key: string; description?: string }
  ): Promise<IRoleServiceResponse>;

  /**
   * Compare two roles and show differences
   */
  compareRoles(roleId1: string, roleId2: string): Promise<IRoleServiceResponse>;
}
