import { type IRoleFilter, type RoleLevel } from '@/validations/role.validation';

import { RoleModel, validateRoleInput, validateRoleUpdate } from '../model/role.model';
import type { IRoleDocument } from '../model/role.model.types';
import {
  type IRoleCreateInput,
  type IRoleInheritanceAssignment,
  type IRolePermissionAssignment,
  type IRoleRepository,
  type IRoleRepositoryResponse,
  type IRoleUpdateInput,
} from './role.repository.types';

export class RoleRepository implements IRoleRepository {
  async create(data: IRoleCreateInput) {
    try {
      // Validate input data
      const validation = validateRoleInput(data);
      if (!validation.success) {
        return {
          success: false,
          error: `Validation error: ${validation.error.issues.map(i => i.message).join(', ')}`,
        };
      }

      // Check if key already exists
      const keyExists = await RoleModel.keyExists(data.key);
      if (keyExists) {
        return {
          success: false,
          error: `Role with key '${data.key}' already exists`,
        };
      }

      // Validate inheritance hierarchy if provided
      if (data.inheritsFrom && data.inheritsFrom.length > 0) {
        const isValidHierarchy = await RoleModel.validateHierarchy('', data.inheritsFrom);
        if (!isValidHierarchy) {
          return {
            success: false,
            error: 'Invalid role hierarchy - circular inheritance detected',
          };
        }
      }

      // Create role
      const role = new RoleModel(data);
      const savedRole = await role.save();

      return {
        success: true,
        data: savedRole,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getById(id: string) {
    try {
      const role = await RoleModel.findById(id)
        .populate('permissions', 'key name description')
        .populate('inheritsFrom', 'key name level')
        .exec();

      if (!role) {
        return {
          success: false,
          error: `Role with ID '${id}' not found`,
        };
      }

      return {
        success: true,
        data: role,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getByKey(key: string): Promise<IRoleRepositoryResponse<IRoleDocument | null>> {
    try {
      const role = await RoleModel.findByKey(key);

      if (!role) {
        return {
          success: false,
          error: `Role with key '${key}' not found`,
        };
      }

      return {
        success: true,
        data: role,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAll(filter: IRoleFilter) {
    try {
      const result = await RoleModel.findWithPagination(filter);

      return {
        success: true,
        data: result.roles,
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
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async update(id: string, data: IRoleUpdateInput) {
    try {
      // Validate input data
      const validation = validateRoleUpdate(data);
      if (!validation.success) {
        return {
          success: false,
          error: `Validation error: ${validation.error.issues.map(i => i.message).join(', ')}`,
        };
      }

      // Check if role exists
      const existingRole = await RoleModel.findById(id).exec();
      if (!existingRole) {
        return {
          success: false,
          error: `Role with ID '${id}' not found`,
        };
      }

      // Check if key already exists (if key is being updated)
      if (data.key && data.key !== existingRole.key) {
        const keyExists = await RoleModel.keyExists(data.key, id);
        if (keyExists) {
          return {
            success: false,
            error: `Role with key '${data.key}' already exists`,
          };
        }
      }

      // Validate inheritance hierarchy if being updated
      if (data.inheritsFrom) {
        const isValidHierarchy = await RoleModel.validateHierarchy(id, data.inheritsFrom);
        if (!isValidHierarchy) {
          return {
            success: false,
            error: 'Invalid role hierarchy - circular inheritance detected',
          };
        }
      }

      // Update role
      const updatedRole = await RoleModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).exec();

      return {
        success: true,
        data: updatedRole,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async delete(id: string) {
    try {
      const role = await RoleModel.findById(id).exec();

      if (!role) {
        return {
          success: false,
          error: `Role with ID '${id}' not found`,
        };
      }

      // Prevent deletion of system-defined roles
      if (role.isSystemDefined) {
        return {
          success: false,
          error: 'Cannot delete system-defined roles',
        };
      }

      // Prevent deletion if role is creator or default role
      if (role.isCreatorRole) {
        return {
          success: false,
          error: 'Cannot delete creator role. Assign another role as creator first.',
        };
      }

      if (role.isDefaultRole) {
        return {
          success: false,
          error: 'Cannot delete default role. Assign another role as default first.',
        };
      }

      // Check if role has members (optional validation)
      // This would require integration with user management system

      await RoleModel.findByIdAndDelete(id).exec();

      return {
        success: true,
        data: { message: 'Role deleted successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getByType(type: string) {
    try {
      const roles = await RoleModel.findByType(type);

      return {
        success: true,
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getByLevel(level: RoleLevel) {
    try {
      const roles = await RoleModel.findByLevel(level);

      return {
        success: true,
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getWithPermission(permissionId: string) {
    try {
      const roles = await RoleModel.findWithPermission(permissionId);

      return {
        success: true,
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async keyExists(key: string, excludeId?: string): Promise<boolean> {
    try {
      return await RoleModel.keyExists(key, excludeId);
    } catch (error) {
      return false;
    }
  }

  async getCreatorRole() {
    try {
      const role = await RoleModel.getCreatorRole();

      if (!role) {
        return {
          success: false,
          error: 'No creator role found',
        };
      }

      return {
        success: true,
        data: role,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getDefaultRole() {
    try {
      const role = await RoleModel.getDefaultRole();

      if (!role) {
        return {
          success: false,
          error: 'No default role found',
        };
      }

      return {
        success: true,
        data: role,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async setCreatorRole(roleId: string) {
    try {
      // Validate role exists and has required permissions
      const role = await RoleModel.findById(roleId).exec();
      if (!role) {
        return {
          success: false,
          error: `Role with ID '${roleId}' not found`,
        };
      }

      await RoleModel.setCreatorRole(roleId);

      return {
        success: true,
        data: { message: 'Creator role set successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async setDefaultRole(roleId: string) {
    try {
      // Validate role exists
      const role = await RoleModel.findById(roleId).exec();
      if (!role) {
        return {
          success: false,
          error: `Role with ID '${roleId}' not found`,
        };
      }

      await RoleModel.setDefaultRole(roleId);

      return {
        success: true,
        data: { message: 'Default role set successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createSystemRoles() {
    try {
      await RoleModel.createSystemRoles();

      return {
        success: true,
        data: { message: 'System roles created successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async assignPermissions(assignment: IRolePermissionAssignment) {
    try {
      const { roleId, permissionIds, action } = assignment;

      const role = await RoleModel.findById(roleId).exec();
      if (!role) {
        return {
          success: false,
          error: `Role with ID '${roleId}' not found`,
        };
      }

      let updatedRole;
      switch (action) {
        case 'add':
          updatedRole = await role.addPermissions(permissionIds);
          break;
        case 'remove':
          updatedRole = await role.removePermissions(permissionIds);
          break;
        case 'replace':
          role.permissions = permissionIds;
          updatedRole = await role.save();
          break;
        default:
          return {
            success: false,
            error: `Invalid action '${action}'`,
          };
      }

      return {
        success: true,
        data: updatedRole,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async setInheritance(assignment: IRoleInheritanceAssignment) {
    try {
      const { roleId, parentRoleIds, action } = assignment;

      const role = await RoleModel.findById(roleId).exec();
      if (!role) {
        return {
          success: false,
          error: `Role with ID '${roleId}' not found`,
        };
      }

      // Validate hierarchy
      const isValidHierarchy = await RoleModel.validateHierarchy(roleId, parentRoleIds);
      if (!isValidHierarchy) {
        return {
          success: false,
          error: 'Invalid role hierarchy - circular inheritance detected',
        };
      }

      let updatedRole;
      switch (action) {
        case 'add':
          updatedRole = await role.addParentRoles(parentRoleIds);
          break;
        case 'remove':
          updatedRole = await role.removeParentRoles(parentRoleIds);
          break;
        case 'replace':
          role.inheritsFrom = parentRoleIds;
          updatedRole = await role.save();
          break;
        default:
          return {
            success: false,
            error: `Invalid action '${action}'`,
          };
      }

      return {
        success: true,
        data: updatedRole,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getHierarchyTree() {
    try {
      const tree = await RoleModel.getHierarchyTree();

      return {
        success: true,
        data: tree,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getChildRoles(parentRoleId: string) {
    try {
      const childRoles = await RoleModel.findChildRoles(parentRoleId);

      return {
        success: true,
        data: childRoles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async validateHierarchy(roleId: string, parentIds: string[]): Promise<boolean> {
    try {
      return await RoleModel.validateHierarchy(roleId, parentIds);
    } catch (error) {
      return false;
    }
  }

  async getEffectivePermissions(roleId: string) {
    try {
      const role = await RoleModel.findById(roleId).exec();
      if (!role) {
        return {
          success: false,
          error: `Role with ID '${roleId}' not found`,
        };
      }

      const effectivePermissions = await role.getEffectivePermissions();

      return {
        success: true,
        data: effectivePermissions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateMemberCount(roleId: string, delta: number) {
    try {
      await RoleModel.updateMemberCount(roleId, delta);

      return {
        success: true,
        data: { message: 'Member count updated successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async bulkAssignPermissions(assignments: IRolePermissionAssignment[]) {
    try {
      const bulkAssignments = assignments.map(({ roleId, permissionIds }) => ({
        roleId,
        permissionIds,
      }));

      await RoleModel.bulkAssignPermissions(bulkAssignments);

      return {
        success: true,
        data: { message: 'Permissions assigned successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getStats() {
    try {
      const [totalCount, activeCount, systemCount, customCount, typeStats, levelStats] =
        await Promise.all([
          RoleModel.countDocuments(),
          RoleModel.countDocuments({ isActive: true }),
          RoleModel.countDocuments({ isSystemDefined: true }),
          RoleModel.countDocuments({ isSystemDefined: false }),
          RoleModel.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
          RoleModel.aggregate([
            { $group: { _id: '$level', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
        ]);

      const stats = {
        total: totalCount,
        active: activeCount,
        inactive: totalCount - activeCount,
        system: systemCount,
        custom: customCount,
        byType: typeStats,
        byLevel: levelStats,
      };

      return {
        success: true,
        data: stats,
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
export const roleRepository = new RoleRepository();
