import type { HydratedDocument, Model } from 'mongoose';

import type {
  IPermissionBase,
  IPermissionFilter,
  IPermissionSchema,
} from '@/validations/permission.validation';

// Mongoose document type
export type IPermissionDocument = HydratedDocument<IPermissionSchema>;

// Permission instance methods
export interface IPermissionSchemaMethods {
  /**
   * Check if permission matches a specific pattern
   */
  matchesPattern(pattern: string): boolean;

  /**
   * Check if permission is hierarchically higher than another
   */
  isHigherThan(otherPermission: IPermissionDocument): boolean;

  /**
   * Get the full permission path for display
   */
  getDisplayPath(): string;
}

// Permission static methods
export interface IPermissionModel extends Model<IPermissionBase, {}, IPermissionSchemaMethods> {
  /**
   * Find permissions with pagination and filtering
   */
  findWithPagination(filter: IPermissionFilter): Promise<{
    permissions: IPermissionDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  /**
   * Find permissions by module
   */
  findByModule(module: string): Promise<IPermissionDocument[]>;

  /**
   * Find permissions by resource
   */
  findByResource(resource: string): Promise<IPermissionDocument[]>;

  /**
   * Find permissions by category
   */
  findByCategory(category: string): Promise<IPermissionDocument[]>;

  /**
   * Check if a permission key exists
   */
  keyExists(key: string, excludeId?: string): Promise<boolean>;

  /**
   * Get all unique modules
   */
  getModules(): Promise<string[]>;

  /**
   * Get all unique resources
   */
  getResources(): Promise<string[]>;

  /**
   * Get all unique actions
   */
  getActions(): Promise<string[]>;

  /**
   * Create default system permissions
   */
  createSystemPermissions(): Promise<void>;

  /**
   * Find by permission key
   */
  findByKey(key: string): Promise<IPermissionDocument | null>;

  /**
   * Bulk create permissions
   */
  createMany(permissions: Partial<IPermissionBase>[]): Promise<IPermissionDocument[]>;
}
