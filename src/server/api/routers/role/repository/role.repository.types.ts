import {
  type IRoleFilter,
  type IRoleSchema,
  type RoleLevel,
  type RoleType,
} from '@/validations/role.validation';

export interface IRoleRepositoryResponse<T = unknown> {
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

export interface IRoleCreateInput {
  key: string;
  name: string;
  description?: string;
  type?: RoleType;
  level?: RoleLevel;
  priority?: number;
  permissions?: string[];
  inheritsFrom?: string[];
  conditions?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  organization?: IRoleSchema['organization'];
  maxMembers?: number;
  validFrom?: Date;
  validUntil?: Date;
}

export interface IRoleUpdateInput {
  key?: string;
  name?: string;
  description?: string;
  type?: RoleType;
  level?: RoleLevel;
  priority?: number;
  permissions?: string[];
  inheritsFrom?: string[];
  conditions?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  organization?: IRoleSchema['organization'];
  maxMembers?: number;
  validFrom?: Date;
  validUntil?: Date;
}

export interface IRolePermissionAssignment {
  roleId: string;
  permissionIds: string[];
  action: 'add' | 'remove' | 'replace';
}

export interface IRoleInheritanceAssignment {
  roleId: string;
  parentRoleIds: string[];
  action: 'add' | 'remove' | 'replace';
}

export interface IRoleRepository {
  /**
   * Create a new role
   */
  create(data: IRoleCreateInput): Promise<IRoleRepositoryResponse>;

  /**
   * Get role by ID
   */
  getById(id: string): Promise<IRoleRepositoryResponse>;

  /**
   * Get role by key
   */
  getByKey(key: string): Promise<IRoleRepositoryResponse>;

  /**
   * Get all roles with pagination and filtering
   */
  getAll(filter: IRoleFilter): Promise<IRoleRepositoryResponse>;

  /**
   * Update role by ID
   */
  update(id: string, data: IRoleUpdateInput): Promise<IRoleRepositoryResponse>;

  /**
   * Delete role by ID
   */
  delete(id: string): Promise<IRoleRepositoryResponse>;

  /**
   * Get roles by type
   */
  getByType(type: RoleType): Promise<IRoleRepositoryResponse>;

  /**
   * Get roles by level
   */
  getByLevel(level: RoleLevel): Promise<IRoleRepositoryResponse>;

  /**
   * Get roles with specific permission
   */
  getWithPermission(permissionId: string): Promise<IRoleRepositoryResponse>;

  /**
   * Check if role key exists
   */
  keyExists(key: string, excludeId?: string): Promise<boolean>;

  /**
   * Get creator role
   */
  getCreatorRole(): Promise<IRoleRepositoryResponse>;

  /**
   * Get default role
   */
  getDefaultRole(): Promise<IRoleRepositoryResponse>;

  /**
   * Set creator role
   */
  setCreatorRole(roleId: string): Promise<IRoleRepositoryResponse>;

  /**
   * Set default role
   */
  setDefaultRole(roleId: string): Promise<IRoleRepositoryResponse>;

  /**
   * Create system roles
   */
  createSystemRoles(): Promise<IRoleRepositoryResponse>;

  /**
   * Assign permissions to role
   */
  assignPermissions(assignment: IRolePermissionAssignment): Promise<IRoleRepositoryResponse>;

  /**
   * Set role inheritance
   */
  setInheritance(assignment: IRoleInheritanceAssignment): Promise<IRoleRepositoryResponse>;

  /**
   * Get role hierarchy tree
   */
  getHierarchyTree(): Promise<IRoleRepositoryResponse>;

  /**
   * Get child roles of a parent role
   */
  getChildRoles(parentRoleId: string): Promise<IRoleRepositoryResponse>;

  /**
   * Validate role hierarchy
   */
  validateHierarchy(roleId: string, parentIds: string[]): Promise<boolean>;

  /**
   * Get effective permissions for a role
   */
  getEffectivePermissions(roleId: string): Promise<IRoleRepositoryResponse>;

  /**
   * Update member count for a role
   */
  updateMemberCount(roleId: string, delta: number): Promise<IRoleRepositoryResponse>;

  /**
   * Bulk assign permissions to multiple roles
   */
  bulkAssignPermissions(assignments: IRolePermissionAssignment[]): Promise<IRoleRepositoryResponse>;

  /**
   * Get role statistics
   */
  getStats(): Promise<IRoleRepositoryResponse>;
}
