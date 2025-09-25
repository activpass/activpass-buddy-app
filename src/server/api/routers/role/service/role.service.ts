import { generateRoleKey, type IRoleFilter, type RoleLevel } from '@/validations/role.validation';

import type { IRoleDocument } from '../model/role.model.types';
import { roleRepository } from '../repository/role.repository';
import {
  type IRoleCreateInput,
  type IRolePermissionAssignment,
  type IRoleUpdateInput,
} from '../repository/role.repository.types';
import { type IRoleService, type IRoleServiceResponse } from './role.service.types';

export class RoleService implements IRoleService {
  async createRole(input: IRoleCreateInput) {
    try {
      const data = { ...input };
      // Auto-generate key if not provided
      if (!data.key && data.name) {
        const namespace = 'org'; // Default namespace, could be configurable
        const roleName = data.name.toLowerCase().replace(/\s+/g, '_');
        data.key = generateRoleKey(namespace, roleName);
      }

      // Business logic validation
      if (!data.key) {
        return {
          success: false,
          error: 'Role key is required or cannot be generated from name',
        };
      }

      // Validate role level permissions if permissions are provided
      if (data.permissions && data.permissions.length > 0) {
        // Could add validation to ensure role level is appropriate for assigned permissions
      }

      // Create role
      const result = await roleRepository.create(data);

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

  async getRoleById(id: string) {
    try {
      const result = await roleRepository.getById(id);

      if (!result.success) {
        return result;
      }

      const role = result.data;

      // Enrich with additional data
      // role.memberCount = await this.getMemberCountForRole(id);
      // role.effectivePermissions = await this.getEffectivePermissions(id);

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

  async getRoleByKey(key: string): Promise<IRoleServiceResponse<IRoleDocument | null>> {
    try {
      const result = await roleRepository.getByKey(key);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllRoles(filter: IRoleFilter) {
    try {
      const result = await roleRepository.getAll(filter);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: result.data?.map(role => role.toObject()),
        pagination: result.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateRole(id: string, data: IRoleUpdateInput) {
    try {
      // Business logic validation
      if (data.key) {
        // Check for conflicting roles
        const existingRole = await roleRepository.getByKey(data.key);
        if (existingRole.success && existingRole.data?.id !== id) {
          return {
            success: false,
            error: `Role with key '${data.key}' already exists`,
          };
        }
      }

      // Validate role hierarchy if being updated
      if (data.inheritsFrom) {
        const isValidHierarchy = await roleRepository.validateHierarchy(id, data.inheritsFrom);
        if (!isValidHierarchy) {
          return {
            success: false,
            error: 'Invalid role hierarchy - circular inheritance detected',
          };
        }
      }

      // Update role
      const result = await roleRepository.update(id, data);

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

  async deleteRole(id: string) {
    try {
      // Additional business logic checks
      // Check if role has active members
      // const memberCount = await this.getMemberCountForRole(id);
      // if (memberCount > 0) {
      //   return {
      //     success: false,
      //     error: 'Cannot delete role that has active members',
      //   };
      // }

      // Check if other roles inherit from this role
      const childRoles = await roleRepository.getChildRoles(id);
      if (childRoles.success && childRoles.data && childRoles.data.length > 0) {
        return {
          success: false,
          error: 'Cannot delete role that has child roles depending on it',
        };
      }

      // Delete role
      const result = await roleRepository.delete(id);

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

  async getRolesByType() {
    try {
      const allRoles = await roleRepository.getAll({
        page: 1,
        limit: 1000,
        isActive: true,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (!allRoles.success) {
        return allRoles;
      }

      if (!allRoles.data) {
        return { success: true, data: {} };
      }

      // Group by type
      const groupedRoles = allRoles.data.reduce(
        (acc, role) => {
          const { type } = role;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(role);
          return acc;
        },
        {} as Record<string, IRoleDocument[]>
      );

      return {
        success: true,
        data: groupedRoles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getRolesByLevel() {
    try {
      const allRoles = await roleRepository.getAll({
        page: 1,
        limit: 1000,
        isActive: true,
        sortBy: 'priority',
        sortOrder: 'asc',
      });

      if (!allRoles.success) {
        return allRoles;
      }

      // Group by level
      const groupedRoles = allRoles.data?.reduce(
        (acc, role) => {
          const { level } = role;
          if (!acc[level]) {
            acc[level] = [];
          }
          acc[level].push(role);
          return acc;
        },
        {} as Record<string, IRoleDocument[]>
      );

      return {
        success: true,
        data: groupedRoles || {},
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchRoles(query: string, filters?: Partial<IRoleFilter>) {
    try {
      const searchFilter: IRoleFilter = {
        search: query,
        page: 1,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'asc',
        ...filters,
      };

      const result = await roleRepository.getAll(searchFilter);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async initializeSystemRoles() {
    try {
      const result = await roleRepository.createSystemRoles();

      if (!result.success) {
        return result;
      }

      // Additional initialization logic
      // Could include setting up default role assignments

      return {
        success: true,
        data: { message: 'System roles initialized successfully' },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async assignPermissionsToRole(assignment: IRolePermissionAssignment) {
    try {
      // Business logic validation
      if (assignment.permissionIds.length === 0 && assignment.action !== 'replace') {
        return {
          success: false,
          error: 'No permissions provided for assignment',
        };
      }

      // Could add validation to ensure permissions are compatible with role level

      const result = await roleRepository.assignPermissions(assignment);

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

  async getEffectivePermissions(roleId: string): Promise<IRoleServiceResponse<string[]>> {
    try {
      const result = await roleRepository.getEffectivePermissions(roleId);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getRoleHierarchy() {
    try {
      const result = await roleRepository.getHierarchyTree();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async setCreatorRole(roleId: string) {
    try {
      // Validate that role has required permissions for creator role
      const effectivePermissions = await this.getEffectivePermissions(roleId);
      if (!effectivePermissions.success) {
        return effectivePermissions;
      }

      // Could add validation to ensure role has required creator permissions

      const result = await roleRepository.setCreatorRole(roleId);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async setDefaultRole(roleId: string) {
    try {
      const result = await roleRepository.setDefaultRole(roleId);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCreatorRole() {
    try {
      const result = await roleRepository.getCreatorRole();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getDefaultRole() {
    try {
      const result = await roleRepository.getDefaultRole();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async validateRoleHierarchy(
    roleId: string,
    parentIds: string[]
  ): Promise<IRoleServiceResponse<boolean>> {
    try {
      const isValid = await roleRepository.validateHierarchy(roleId, parentIds);
      return {
        success: true,
        data: isValid,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getRoleStats() {
    try {
      const result = await roleRepository.getStats();

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

  async bulkAssignPermissions(assignments: IRolePermissionAssignment[]) {
    try {
      // Validate all assignments
      for (const assignment of assignments) {
        if (!assignment.roleId || !assignment.permissionIds) {
          return {
            success: false,
            error: 'Invalid assignment data',
          };
        }
      }

      const result = await roleRepository.bulkAssignPermissions(assignments);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async exportRoles(format: 'json' | 'csv' | 'excel') {
    try {
      const allRoles = await roleRepository.getAll({
        page: 1,
        limit: 10000,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (!allRoles.success) {
        return allRoles;
      }

      let exportData;
      switch (format) {
        case 'json': {
          exportData = JSON.stringify(allRoles.data, null, 2);
          break;
        }
        case 'csv': {
          const headers = [
            'Key',
            'Name',
            'Type',
            'Level',
            'Priority',
            'Description',
            'Permissions Count',
            'Active',
          ];
          const csvData = [
            headers.join(','),
            ...(allRoles.data || []).map(role =>
              [
                role.key,
                role.name,
                role.type,
                role.level,
                role.priority,
                role.description || '',
                role.permissions?.length || 0,
                role.isActive,
              ]
                .map(field => `"${field}"`)
                .join(',')
            ),
          ].join('\n');
          exportData = csvData;
          break;
        }
        case 'excel': {
          exportData = {
            worksheets: [
              {
                name: 'Roles',
                data: allRoles.data,
              },
            ],
          };
          break;
        }
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
          filename: `roles_export_${new Date().toISOString().split('T')[0]}.${format}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async checkUserRole(_userId: string, roleKey: string): Promise<IRoleServiceResponse<boolean>> {
    try {
      // This would require integration with user management system
      // For now, returning a placeholder implementation

      const role = await roleRepository.getByKey(roleKey);
      if (!role.success) {
        return {
          success: true,
          data: false, // Role doesn't exist, so user doesn't have it
        };
      }

      // TODO: Implement actual user-role checking
      // This would involve:
      // 1. Getting user's assigned roles
      // 2. Checking if the role is in the user's roles
      // 3. Considering role inheritance

      return {
        success: true,
        data: true, // Placeholder - always grant for now
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getSuggestedRoles(context: {
    userLevel?: RoleLevel;
    department?: string;
    permissions?: string[];
  }) {
    try {
      const filter: Partial<IRoleFilter> = {
        page: 1,
        limit: 50,
        isActive: true,
        sortBy: 'priority',
        sortOrder: 'asc',
      };

      if (context.userLevel) {
        filter.level = context.userLevel;
      }

      const result = await roleRepository.getAll(filter as IRoleFilter);

      if (!result.success) {
        return result;
      }

      let suggestions = result.data || [];

      // Filter based on permissions if provided
      if (context.permissions && context.permissions.length > 0) {
        suggestions = suggestions.filter(role => {
          return context.permissions!.some(permission => role.permissions.includes(permission));
        });
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

  async cloneRole(
    sourceRoleId: string,
    newRoleData: { name: string; key: string; description?: string }
  ) {
    try {
      // Get source role
      const sourceRole = await roleRepository.getById(sourceRoleId);
      if (!sourceRole.success) {
        return sourceRole;
      }

      // Check if new key already exists
      const keyExists = await roleRepository.keyExists(newRoleData.key);
      if (keyExists) {
        return {
          success: false,
          error: `Role with key '${newRoleData.key}' already exists`,
        };
      }

      // Create new role based on source
      const newRole: IRoleCreateInput & {
        isSystemDefined: boolean;
        isCreatorRole: boolean;
        isDefaultRole: boolean;
        id?: string;
        createdAt?: Date;
        updatedAt?: Date;
        memberCount?: number;
      } = {
        ...sourceRole.data,
        ...newRoleData,
        isSystemDefined: false, // Cloned roles are never system-defined
        isCreatorRole: false, // Cloned roles are never creator roles
        isDefaultRole: false, // Cloned roles are never default roles
      };

      // Remove fields that shouldn't be copied
      delete newRole.id;
      delete newRole.createdAt;
      delete newRole.updatedAt;
      delete newRole.memberCount;

      const result = await this.createRole(newRole);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async compareRoles(roleId1: string, roleId2: string) {
    try {
      const [role1Result, role2Result] = await Promise.all([
        roleRepository.getById(roleId1),
        roleRepository.getById(roleId2),
      ]);

      if (!role1Result.data) {
        return {
          success: false,
          error: `First role not found: ${role1Result.error}`,
        };
      }

      if (!role2Result.data) {
        return {
          success: false,
          error: `Second role not found: ${role2Result.error}`,
        };
      }

      const role1 = role1Result.data;
      const role2 = role2Result.data;

      // Get effective permissions for both roles
      const [perms1Result, perms2Result] = await Promise.all([
        this.getEffectivePermissions(roleId1),
        this.getEffectivePermissions(roleId2),
      ]);

      const effectivePerms1 = perms1Result.success ? perms1Result.data || [] : [];
      const effectivePerms2 = perms2Result.success ? perms2Result.data || [] : [];

      // Calculate differences
      const onlyInRole1 = effectivePerms1.filter((perm: string) => !effectivePerms2.includes(perm));
      const onlyInRole2 = effectivePerms2.filter((perm: string) => !effectivePerms1.includes(perm));
      const commonPermissions = effectivePerms1.filter((perm: string) =>
        effectivePerms2.includes(perm)
      );

      const comparison = {
        role1: {
          id: role1.id,
          name: role1.name,
          key: role1.key,
          level: role1.level,
          type: role1.type,
          priority: role1.priority,
          permissionCount: effectivePerms1.length,
        },
        role2: {
          id: role2.id,
          name: role2.name,
          key: role2.key,
          level: role2.level,
          type: role2.type,
          priority: role2.priority,
          permissionCount: effectivePerms2.length,
        },
        differences: {
          onlyInRole1,
          onlyInRole2,
          commonPermissions,
          totalDifferences: onlyInRole1.length + onlyInRole2.length,
        },
        similarity: {
          percentage:
            (commonPermissions.length /
              Math.max(effectivePerms1.length, effectivePerms2.length, 1)) *
            100,
          commonCount: commonPermissions.length,
        },
      };

      return {
        success: true,
        data: comparison,
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
export const roleService = new RoleService();
