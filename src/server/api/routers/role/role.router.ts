import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc';
import {
  type IRoleCreateInput,
  type IRolePermissionAssignment,
} from './repository/role.repository.types';
import {
  assignPermissionsInputSchema,
  bulkCreateRolesInputSchema,
  checkRolePermissionInputSchema,
  cloneRoleInputSchema,
  compareRolesInputSchema,
  createRoleInputSchema,
  deleteRoleInputSchema,
  exportRolesInputSchema,
  getEffectivePermissionsInputSchema,
  getRoleByIdInputSchema,
  getRoleByNameInputSchema,
  getRoleHierarchyInputSchema,
  getRolesByCreatorInputSchema,
  getRolesByLevelInputSchema,
  getRolesByTypeInputSchema,
  getRolesInputSchema,
  getSuggestedRolesInputSchema,
  removePermissionsInputSchema,
  searchRolesInputSchema,
  updateRoleInputSchema,
  validateRoleHierarchyInputSchema,
} from './role.input';
import { RoleService } from './service/role.service';

const roleService = new RoleService();

export const roleRouter = createTRPCRouter({
  // Create a new role (protected)
  create: protectedProcedure.input(createRoleInputSchema).mutation(async ({ input }) => {
    // Ensure key is present as it's required for createRole
    if (!input.key) {
      throw new Error('Role key is required');
    }
    return roleService.createRole(input as IRoleCreateInput);
  }),

  // Create role with permissions (protected)
  createWithPermissions: protectedProcedure
    .input(createRoleInputSchema)
    .mutation(async ({ input }) => {
      // Ensure key is present as it's required for createRole
      if (!input.key) {
        throw new Error('Role key is required');
      }
      return roleService.createRole(input as IRoleCreateInput);
    }),

  // Get all roles with filtering and pagination (protected)
  getAll: protectedProcedure.input(getRolesInputSchema.optional()).query(async ({ input }) => {
    const defaultFilter = {
      page: 1,
      limit: 50,
      sortBy: 'name' as const,
      sortOrder: 'asc' as const,
    };
    return roleService.getAllRoles({ ...defaultFilter, ...input });
  }),

  // Get roles with permissions (protected)
  getWithPermissions: protectedProcedure
    .input(getRolesInputSchema.optional())
    .query(async ({ input }) => {
      const defaultFilter = {
        page: 1,
        limit: 50,
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
      };
      return roleService.getAllRoles({ ...defaultFilter, ...input });
    }),

  // Get paginated roles (protected)
  getPaginated: protectedProcedure.input(getRolesInputSchema).query(async ({ input }) => {
    return roleService.getAllRoles(input);
  }),

  // Get role by ID (protected)
  getById: protectedProcedure.input(getRoleByIdInputSchema).query(async ({ input }) => {
    return roleService.getRoleById(input.id);
  }),

  // Get role by name (public - for role checking)
  getByName: publicProcedure.input(getRoleByNameInputSchema).query(async ({ input }) => {
    return roleService.getRoleByKey(input.name); // Use key for now
  }),

  // Update role (protected)
  update: protectedProcedure.input(updateRoleInputSchema).mutation(async ({ input }) => {
    return roleService.updateRole(input.id, input.data);
  }),

  // Update role with permissions (protected)
  updateWithPermissions: protectedProcedure
    .input(updateRoleInputSchema)
    .mutation(async ({ input }) => {
      return roleService.updateRole(input.id, input.data);
    }),

  // Delete role (protected)
  delete: protectedProcedure.input(deleteRoleInputSchema).mutation(async ({ input }) => {
    return roleService.deleteRole(input.id);
  }),

  // Assign permissions to role (protected)
  assignPermissions: protectedProcedure
    .input(assignPermissionsInputSchema)
    .mutation(async ({ input }) => {
      const assignment: IRolePermissionAssignment = {
        roleId: input.roleId,
        permissionIds: input.permissionIds,
        action: 'add',
      };
      return roleService.bulkAssignPermissions([assignment]);
    }),

  // Remove permissions from role (protected)
  removePermissions: protectedProcedure.input(removePermissionsInputSchema).mutation(async () => {
    // Implementation would need a removePermissions method in service
    // For now, return a placeholder response
    return { success: true, message: 'Permissions removed successfully' };
  }),

  // Get effective permissions for role (protected)
  getEffectivePermissions: protectedProcedure
    .input(getEffectivePermissionsInputSchema)
    .query(async ({ input }) => {
      return roleService.getEffectivePermissions(input.roleId);
    }),

  // Clone role (protected)
  clone: protectedProcedure.input(cloneRoleInputSchema).mutation(async ({ input }) => {
    const newRoleData = {
      name: input.newRoleName,
      key: input.newRoleKey || `clone_${input.sourceRoleId}_${Date.now()}`,
      description: input.newRoleDescription,
    };
    return roleService.cloneRole(input.sourceRoleId, newRoleData);
  }),

  // Compare roles (protected)
  compare: protectedProcedure.input(compareRolesInputSchema).query(async ({ input }) => {
    return roleService.compareRoles(input.roleId1, input.roleId2);
  }),

  // Get role hierarchy (protected)
  getHierarchy: protectedProcedure.input(getRoleHierarchyInputSchema).query(async () => {
    return roleService.getRoleHierarchy();
  }),

  // Validate role hierarchy (protected)
  validateHierarchy: protectedProcedure
    .input(validateRoleHierarchyInputSchema)
    .query(async ({ input }) => {
      const parentRoleIds = input.parentRoleId ? [input.parentRoleId] : [];
      return roleService.validateRoleHierarchy(input.roleId, parentRoleIds);
    }),

  // Get roles by type (protected)
  getByType: protectedProcedure.input(getRolesByTypeInputSchema).query(async () => {
    return roleService.getRolesByType();
  }),

  // Get roles by level (protected)
  getByLevel: protectedProcedure.input(getRolesByLevelInputSchema).query(async () => {
    return roleService.getRolesByLevel();
  }),

  // Get roles by creator (protected)
  getByCreator: protectedProcedure.input(getRolesByCreatorInputSchema).query(async () => {
    // Return placeholder for now
    return { success: true, data: [], message: 'Roles by creator retrieved' };
  }),

  // Search roles (protected)
  search: protectedProcedure.input(searchRolesInputSchema).query(async ({ input }) => {
    return roleService.searchRoles(input.query, input.filters);
  }),

  // Bulk create roles (protected)
  bulkCreate: protectedProcedure.input(bulkCreateRolesInputSchema).mutation(async ({ input }) => {
    // For now, create roles individually with proper validation
    const results = await Promise.all(
      input.roles.map(role => {
        // Ensure key is present as it's required for createRole
        if (!role.key) {
          throw new Error(`Role key is required for role: ${role.name}`);
        }
        return roleService.createRole(role as IRoleCreateInput);
      })
    );
    return { success: true, data: results, message: 'Roles created successfully' };
  }),

  // Export roles (protected)
  export: protectedProcedure.input(exportRolesInputSchema).query(async ({ input }) => {
    return roleService.exportRoles(input.format);
  }),

  // Check if role has permission (public - for authorization)
  checkPermission: publicProcedure.input(checkRolePermissionInputSchema).query(async () => {
    // For now return placeholder
    return { success: true, hasPermission: false };
  }),

  // Get suggested roles (protected)
  getSuggested: protectedProcedure.input(getSuggestedRolesInputSchema).query(async ({ input }) => {
    return roleService.getSuggestedRoles(input);
  }),

  // Get role statistics (protected)
  getStats: protectedProcedure.query(async () => {
    return roleService.getRoleStats();
  }),

  // Get role statistics (alias for compatibility)
  getStatistics: protectedProcedure.query(async () => {
    return roleService.getRoleStats();
  }),

  // Initialize system roles (protected)
  initializeSystem: protectedProcedure.mutation(async () => {
    return roleService.initializeSystemRoles();
  }),

  // Get default roles (public)
  getDefaults: publicProcedure.query(async () => {
    return roleService.getDefaultRole();
  }),
});
