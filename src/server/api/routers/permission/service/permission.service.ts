import {
  generatePermissionKey,
  type IPermissionBase,
  type IPermissionFilter,
} from '@/validations/permission.validation';

import type { IPermissionDocument } from '../model/permission.model.types';
import { permissionRepository } from '../repository/permission.repository';
import {
  type IPermissionCreateInput,
  type IPermissionUpdateInput,
} from '../repository/permission.repository.types';
import { type IPermissionService } from './permission.service.types';

export class PermissionService implements IPermissionService {
  async createPermission(input: IPermissionCreateInput) {
    try {
      const data = { ...input };
      // Auto-generate key if not provided
      if (!data.key && data.module && data.resource && data.action) {
        data.key = generatePermissionKey(data.module, data.resource, data.action);
      }

      // Business logic validation
      if (!data.key) {
        return {
          success: false,
          error: 'Permission key is required or cannot be generated from module:resource:action',
        };
      }

      // Check for conflicting permissions
      const existingPermission = await permissionRepository.getByKey(data.key);
      if (existingPermission.success) {
        return {
          success: false,
          error: `Permission with key '${data.key}' already exists`,
        };
      }

      // Create permission
      const result = await permissionRepository.create(data);

      if (!result.success) {
        return result;
      }

      // Additional business logic after creation
      // Could include audit logging, notifications, etc.

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPermissionById(id: string) {
    try {
      const result = await permissionRepository.getById(id);

      if (!result.success) {
        return result;
      }

      // Enrich with additional data
      const permission = result.data;

      // Add role count using this permission (would require role repository integration)
      // permission.roleCount = await this.getRoleCountForPermission(id);

      return {
        success: true,
        data: permission,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPermissionByKey(key: string) {
    try {
      const result = await permissionRepository.getByKey(key);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllPermissions(filter: IPermissionFilter) {
    try {
      const result = await permissionRepository.getAll(filter);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updatePermission(id: string, data: IPermissionUpdateInput) {
    try {
      // Business logic validation
      if (data.key) {
        // Check for conflicting permissions
        const existingPermission = await permissionRepository.getByKey(data.key);
        if (
          existingPermission.success &&
          existingPermission.data &&
          existingPermission.data.id !== id
        ) {
          return {
            success: false,
            error: `Permission with key '${data.key}' already exists`,
          };
        }
      }

      // Update permission
      const result = await permissionRepository.update(id, data);

      if (!result.success) {
        return result;
      }

      // Additional business logic after update
      // Could include audit logging, cache invalidation, etc.

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deletePermission(id: string) {
    try {
      // Check if permission is in use by roles
      // This would require integration with role repository
      // const rolesUsingPermission = await roleRepository.getWithPermission(id);
      // if (rolesUsingPermission.success && rolesUsingPermission.data.length > 0) {
      //   return {
      //     success: false,
      //     error: 'Cannot delete permission that is assigned to roles',
      //   };
      // }

      // Delete permission
      const result = await permissionRepository.delete(id);

      if (!result.success) {
        return result;
      }

      // Additional cleanup logic
      // Could include cache invalidation, audit logging, etc.

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPermissionsByCategory() {
    try {
      const allPermissions = await permissionRepository.getAll({
        page: 1,
        limit: 1000, // Get all permissions
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (!allPermissions.success) {
        return allPermissions;
      }

      // Group by category
      const groupedPermissions = (allPermissions.data || []).reduce(
        (acc, permission) => {
          const { category } = permission;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(permission);
          return acc;
        },
        {} as Record<string, IPermissionDocument[]>
      );

      return {
        success: true,
        data: groupedPermissions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPermissionsByModule() {
    try {
      const allPermissions = await permissionRepository.getAll({
        page: 1,
        limit: 1000, // Get all permissions
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (!allPermissions.success) {
        return allPermissions;
      }

      // Group by module
      const groupedPermissions = (allPermissions.data || []).reduce(
        (acc, permission) => {
          const { module: permissionModule } = permission;
          if (!acc[permissionModule]) {
            acc[permissionModule] = [];
          }
          acc[permissionModule].push(permission);
          return acc;
        },
        {} as Record<string, IPermissionDocument[]>
      );

      return {
        success: true,
        data: groupedPermissions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPermissionsByResource() {
    try {
      const allPermissions = await permissionRepository.getAll({
        page: 1,
        limit: 1000, // Get all permissions
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (!allPermissions.success) {
        return allPermissions;
      }

      // Group by resource
      const groupedPermissions = (allPermissions.data || []).reduce(
        (acc, permission) => {
          const { resource: permissionResource } = permission;
          if (!acc[permissionResource]) {
            acc[permissionResource] = [];
          }
          acc[permissionResource].push(permission);
          return acc;
        },
        {} as Record<string, IPermissionDocument[]>
      );

      return {
        success: true,
        data: groupedPermissions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchPermissions(query: string, filters?: Partial<IPermissionFilter>) {
    try {
      const searchFilter: IPermissionFilter = {
        search: query,
        page: 1,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'asc',
        ...filters,
      };

      const result = await permissionRepository.getAll(searchFilter);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async initializeSystemPermissions() {
    try {
      const result = await permissionRepository.createSystemPermissions();

      if (!result.success) {
        return result;
      }

      // Initialize related system data if needed
      // Could include creating default roles with these permissions

      return {
        success: true,
        data: { message: 'System permissions initialized successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async validatePermissionHierarchy(permissionKey: string) {
    try {
      // Basic validation of permission key format
      const keyPattern = /^[a-z_]+:[a-z_]+:[a-z_]+$/;
      const isValidFormat = keyPattern.test(permissionKey);

      if (!isValidFormat) {
        return {
          success: true,
          data: false,
        };
      }

      // Additional hierarchy validation logic could be added here
      // For example, checking if parent permissions exist

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPermissionStats() {
    try {
      const result = await permissionRepository.getStats();

      if (!result.success) {
        return result;
      }

      // Enrich with additional statistics
      const enrichedStats = {
        ...result.data,
        lastUpdated: new Date(),
        // Add more computed statistics here
      };

      return {
        success: true,
        data: enrichedStats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async bulkCreatePermissions(permissions: IPermissionCreateInput[]) {
    try {
      // Business logic validation for bulk operations
      const validatedPermissions = permissions.map(permission => {
        const perm = { ...permission };
        if (!perm.key && perm.module && perm.resource && perm.action) {
          perm.key = generatePermissionKey(perm.module, perm.resource, perm.action);
        }
        return perm;
      });

      // Check for duplicates within the batch
      const keys = validatedPermissions.map(p => p.key);
      const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);

      if (duplicateKeys.length > 0) {
        return {
          success: false,
          error: `Duplicate keys found in batch: ${duplicateKeys.join(', ')}`,
        };
      }

      const result = await permissionRepository.createMany(validatedPermissions);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async exportPermissions(format: 'json' | 'csv' | 'excel') {
    try {
      const allPermissions = await permissionRepository.getAll({
        page: 1,
        limit: 10000, // Large limit to get all permissions
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (!allPermissions.success) {
        return allPermissions;
      }

      let exportData;
      switch (format) {
        case 'json':
          exportData = JSON.stringify(allPermissions.data, null, 2);
          break;
        case 'csv': {
          // Convert to CSV format
          const headers = [
            'Key',
            'Name',
            'Module',
            'Resource',
            'Action',
            'Category',
            'Description',
          ];
          const csvData = [
            headers.join(','),
            ...(allPermissions.data || []).map(permission =>
              [
                permission.key,
                permission.name,
                permission.module,
                permission.resource,
                permission.action,
                permission.category,
                permission.description || '',
              ]
                .map((field: string | number | boolean) => `"${String(field)}"`)
                .join(',')
            ),
          ].join('\n');
          exportData = csvData;
          break;
        }
        case 'excel':
          // For Excel format, you'd typically use a library like xlsx
          // For now, returning structured data that can be processed by the client
          exportData = {
            worksheets: [
              {
                name: 'Permissions',
                data: allPermissions.data,
              },
            ],
          };
          break;
        default:
          return {
            success: false,
            error: `Unsupported export format: ${format}`,
          };
      }

      return {
        success: true,
        data: {
          format,
          content: exportData,
          filename: `permissions_export_${new Date().toISOString().split('T')[0]}.${format}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async checkPermission(userRoles: string[], permissionKey: string) {
    try {
      // This would require integration with role service to get effective permissions
      // For now, returning a placeholder implementation

      const permission = await permissionRepository.getByKey(permissionKey);
      if (!permission.success) {
        return {
          success: true,
          data: false, // Permission doesn't exist, so access denied
        };
      }

      // TODO: Implement actual role-based permission checking
      // This would involve:
      // 1. Getting all roles for the user (using userRoles parameter)
      // 2. Getting effective permissions for each role (including inherited)
      // 3. Checking if the permission is in the effective permissions

      // For now, we'll check if userRoles array is not empty as a basic validation
      const hasRoles = userRoles && userRoles.length > 0;

      return {
        success: true,
        data: hasRoles, // Grant access only if user has roles
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getSuggestedPermissions(context: {
    module?: IPermissionBase['module'];
    resource?: IPermissionBase['resource'];
    role?: string;
  }) {
    try {
      const filter: Partial<IPermissionFilter> = {
        page: 1,
        limit: 50,
        isActive: true,
      };

      // Type-safe assignment of module and resource
      if (context.module) {
        // Cast to the expected enum type after validation
        filter.module = context.module;
      }

      if (context.resource) {
        // Cast to the expected enum type after validation
        filter.resource = context.resource;
      }

      const result = await permissionRepository.getAll(filter as IPermissionFilter);

      if (!result.success) {
        return result;
      }

      // Additional logic to filter based on role context
      const suggestions = result.data;

      if (context.role) {
        // Filter permissions based on role level or type
        // This would require more sophisticated logic based on your business rules
      }

      return {
        success: true,
        data: suggestions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Export a singleton instance
export const permissionService = new PermissionService();
