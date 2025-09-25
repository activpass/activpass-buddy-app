import { type IPermissionBase, type IPermissionFilter } from '@/validations/permission.validation';

export type IPermissionRepositoryResponse<T = unknown> =
  | {
      data: T;
      pagination?: {
        total: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    }
  | {
      error: string;
    };

export interface IPermissionCreateInput
  extends Pick<IPermissionBase, 'module' | 'resource' | 'action' | 'category' | 'organization'> {
  key: string;
  name: string;
  description?: string;
  priority?: number;
  conditions?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
}

export interface IPermissionUpdateInput extends Partial<IPermissionCreateInput> {}

export interface IPermissionRepository {
  /**
   * Create a new permission
   */
  create(data: IPermissionCreateInput): Promise<IPermissionRepositoryResponse>;

  /**
   * Get permission by ID
   */
  getById(id: string): Promise<IPermissionRepositoryResponse>;

  /**
   * Get permission by key
   */
  getByKey(key: string): Promise<IPermissionRepositoryResponse>;

  /**
   * Get all permissions with pagination and filtering
   */
  getAll(filter: IPermissionFilter): Promise<IPermissionRepositoryResponse>;

  /**
   * Update permission by ID
   */
  update(id: string, data: IPermissionUpdateInput): Promise<IPermissionRepositoryResponse>;

  /**
   * Delete permission by ID
   */
  delete(id: string): Promise<IPermissionRepositoryResponse>;

  /**
   * Get permissions by module
   */
  getByModule(module: string): Promise<IPermissionRepositoryResponse>;

  /**
   * Get permissions by resource
   */
  getByResource(resource: string): Promise<IPermissionRepositoryResponse>;

  /**
   * Get permissions by category
   */
  getByCategory(category: string): Promise<IPermissionRepositoryResponse>;

  /**
   * Check if permission key exists
   */
  keyExists(key: string, excludeId?: string): Promise<boolean>;

  /**
   * Get all unique modules
   */
  getModules(): Promise<IPermissionRepositoryResponse>;

  /**
   * Get all unique resources
   */
  getResources(): Promise<IPermissionRepositoryResponse>;

  /**
   * Get all unique actions
   */
  getActions(): Promise<IPermissionRepositoryResponse>;

  /**
   * Bulk create permissions
   */
  createMany(permissions: IPermissionCreateInput[]): Promise<IPermissionRepositoryResponse>;

  /**
   * Create system permissions
   */
  createSystemPermissions(): Promise<IPermissionRepositoryResponse>;

  /**
   * Get permission statistics
   */
  getStats(): Promise<IPermissionRepositoryResponse>;
}
