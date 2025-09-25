import { type IPermissionFilter } from '@/validations/permission.validation';

import {
  PermissionModel,
  validatePermissionInput,
  validatePermissionUpdate,
} from '../model/permission.model';
import {
  type IPermissionCreateInput,
  type IPermissionRepository,
  type IPermissionUpdateInput,
} from './permission.repository.types';

export class PermissionRepository implements IPermissionRepository {
  async create(data: IPermissionCreateInput) {
    try {
      // Validate input data
      const validation = validatePermissionInput(data);
      if (validation.error) {
        return {
          error: `Validation error: ${validation.error.issues.map(i => i.message).join(', ')}`,
        };
      }

      // Check if key already exists
      const keyExists = await PermissionModel.keyExists(data.key);
      if (keyExists) {
        return {
          error: `Permission with key '${data.key}' already exists`,
        };
      }

      // Create permission
      const permission = new PermissionModel(data);
      const savedPermission = await permission.save();

      return {
        data: savedPermission,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getById(id: string) {
    try {
      const permission = await PermissionModel.findById(id).exec();

      if (!permission) {
        return {
          error: `Permission with ID '${id}' not found`,
        };
      }

      return {
        data: permission,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getByKey(key: string) {
    try {
      const permission = await PermissionModel.findByKey(key);

      if (!permission) {
        return {
          error: `Permission with key '${key}' not found`,
        };
      }

      return {
        data: permission,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAll(filter: IPermissionFilter) {
    try {
      const result = await PermissionModel.findWithPagination(filter);
      return {
        data: result.permissions,
        pagination: {
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async update(id: string, data: IPermissionUpdateInput) {
    try {
      // Validate input data
      const validation = validatePermissionUpdate(data);
      if (validation.error) {
        return {
          error: `Validation error: ${validation.error.issues.map(i => i.message).join(', ')}`,
        };
      }

      // Check if permission exists
      const existingPermission = await PermissionModel.findById(id).exec();
      if (!existingPermission) {
        return {
          error: `Permission with ID '${id}' not found`,
        };
      }

      // Check if key already exists (if key is being updated)
      if (data.key && data.key !== existingPermission.key) {
        const keyExists = await PermissionModel.keyExists(data.key, id);
        if (keyExists) {
          return {
            error: `Permission with key '${data.key}' already exists`,
          };
        }
      }

      // Update permission
      const updatedPermission = await PermissionModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).exec();

      return {
        data: updatedPermission,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async delete(id: string) {
    try {
      const permission = await PermissionModel.findById(id).exec();

      if (!permission) {
        return {
          error: `Permission with ID '${id}' not found`,
        };
      }

      // Prevent deletion of system-defined permissions
      if (permission.isSystemDefined) {
        return {
          error: 'Cannot delete system-defined permissions',
        };
      }

      await PermissionModel.findByIdAndDelete(id).exec();

      return {
        data: { message: 'Permission deleted successfully' },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getByModule(module: string) {
    try {
      const permissions = await PermissionModel.findByModule(module);

      return {
        data: permissions,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getByResource(resource: string) {
    try {
      const permissions = await PermissionModel.findByResource(resource);

      return {
        data: permissions,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getByCategory(category: string) {
    try {
      const permissions = await PermissionModel.findByCategory(category);

      return {
        data: permissions,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async keyExists(key: string, excludeId?: string): Promise<boolean> {
    try {
      return await PermissionModel.keyExists(key, excludeId);
    } catch (error) {
      return false;
    }
  }

  async getModules() {
    try {
      const modules = await PermissionModel.getModules();

      return {
        data: modules,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getResources() {
    try {
      const resources = await PermissionModel.getResources();

      return {
        data: resources,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getActions() {
    try {
      const actions = await PermissionModel.getActions();

      return {
        data: actions,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createMany(permissions: IPermissionCreateInput[]) {
    try {
      // Validate all permissions
      for (const permission of permissions) {
        const validation = validatePermissionInput(permission);
        if (validation.error) {
          return {
            error: `Validation error for permission '${permission.key}': ${validation.error.issues.map(i => i.message).join(', ')}`,
          };
        }
      }

      // Check for duplicate keys within the input
      const keys = permissions.map(p => p.key);
      const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
      if (duplicateKeys.length > 0) {
        return {
          error: `Duplicate keys found in input: ${duplicateKeys.join(', ')}`,
        };
      }

      // Check for existing keys
      const existingPermissions = await PermissionModel.find({
        key: { $in: keys },
      }).exec();

      if (existingPermissions.length > 0) {
        const existingKeys = existingPermissions.map(p => p.key);
        return {
          error: `Permissions with these keys already exist: ${existingKeys.join(', ')}`,
        };
      }

      // Create permissions
      const createdPermissions = await PermissionModel.createMany(permissions);

      return {
        data: createdPermissions,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createSystemPermissions() {
    try {
      await PermissionModel.createSystemPermissions();

      return {
        data: { message: 'System permissions created successfully' },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getStats() {
    try {
      const [totalCount, activeCount, systemCount, customCount, moduleStats, categoryStats] =
        await Promise.all([
          PermissionModel.countDocuments(),
          PermissionModel.countDocuments({ isActive: true }),
          PermissionModel.countDocuments({ isSystemDefined: true }),
          PermissionModel.countDocuments({ isSystemDefined: false }),
          PermissionModel.aggregate([
            { $group: { _id: '$module', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
          PermissionModel.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
        ]);

      const stats = {
        total: totalCount,
        active: activeCount,
        inactive: totalCount - activeCount,
        system: systemCount,
        custom: customCount,
        byModule: moduleStats,
        byCategory: categoryStats,
      };

      return {
        data: stats,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Export a singleton instance
export const permissionRepository = new PermissionRepository();
