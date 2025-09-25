import { type IPermissionFilter } from '@/validations/permission.validation';

import {
  type IPermissionCreateInput,
  type IPermissionUpdateInput,
} from '../repository/permission.repository.types';

export interface IPermissionServiceResponse<T = unknown> {
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

export interface IPermissionService {
  /**
   * Create a new permission with business logic validation
   */
  createPermission(data: IPermissionCreateInput): Promise<IPermissionServiceResponse>;

  /**
   * Get permission by ID with related data
   */
  getPermissionById(id: string): Promise<IPermissionServiceResponse>;

  /**
   * Get permission by key
   */
  getPermissionByKey(key: string): Promise<IPermissionServiceResponse>;

  /**
   * Get all permissions with filtering and pagination
   */
  getAllPermissions(filter: IPermissionFilter): Promise<IPermissionServiceResponse>;

  /**
   * Update permission with validation
   */
  updatePermission(id: string, data: IPermissionUpdateInput): Promise<IPermissionServiceResponse>;

  /**
   * Delete permission with dependency checks
   */
  deletePermission(id: string): Promise<IPermissionServiceResponse>;

  /**
   * Get permissions grouped by category
   */
  getPermissionsByCategory(): Promise<IPermissionServiceResponse>;

  /**
   * Get permissions grouped by module
   */
  getPermissionsByModule(): Promise<IPermissionServiceResponse>;

  /**
   * Search permissions with advanced filters
   */
  searchPermissions(
    query: string,
    filters?: Partial<IPermissionFilter>
  ): Promise<IPermissionServiceResponse>;

  /**
   * Initialize system permissions
   */
  initializeSystemPermissions(): Promise<IPermissionServiceResponse>;

  /**
   * Validate permission hierarchy and dependencies
   */
  validatePermissionHierarchy(permissionKey: string): Promise<IPermissionServiceResponse<boolean>>;

  /**
   * Get permission statistics and analytics
   */
  getPermissionStats(): Promise<IPermissionServiceResponse>;

  /**
   * Bulk create permissions with validation
   */
  bulkCreatePermissions(permissions: IPermissionCreateInput[]): Promise<IPermissionServiceResponse>;

  /**
   * Export permissions to different formats
   */
  exportPermissions(format: 'json' | 'csv' | 'excel'): Promise<IPermissionServiceResponse>;

  /**
   * Check if user has permission to perform action
   */
  checkPermission(
    userRoles: string[],
    permissionKey: string
  ): Promise<IPermissionServiceResponse<boolean>>;

  /**
   * Get suggested permissions based on role or pattern
   */
  getSuggestedPermissions(context: {
    module?: string;
    resource?: string;
    role?: string;
  }): Promise<IPermissionServiceResponse>;
}
