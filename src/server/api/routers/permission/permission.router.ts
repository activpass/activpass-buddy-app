import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc';
import {
  bulkCreatePermissionsInputSchema,
  checkPermissionInputSchema,
  createPermissionInputSchema,
  deletePermissionInputSchema,
  exportPermissionsInputSchema,
  getPermissionByIdInputSchema,
  getPermissionByKeyInputSchema,
  getPermissionsByCategoryInputSchema,
  getPermissionsByModuleInputSchema,
  getPermissionsByResourceInputSchema,
  getPermissionsInputSchema,
  getSuggestedPermissionsInputSchema,
  searchPermissionsInputSchema,
  updatePermissionInputSchema,
  validatePermissionHierarchyInputSchema,
} from './permission.input';
import { PermissionService } from './service/permission.service';

const permissionService = new PermissionService();

export const permissionRouter = createTRPCRouter({
  // Create a new permission (protected)
  create: protectedProcedure.input(createPermissionInputSchema).mutation(async ({ input }) => {
    return permissionService.createPermission(input);
  }),

  // Get all permissions with filtering and pagination (protected)
  getAll: protectedProcedure
    .input(getPermissionsInputSchema.optional())
    .query(async ({ input }) => {
      const defaultFilter = {
        page: 1,
        limit: 50,
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
      };
      return permissionService.getAllPermissions({ ...defaultFilter, ...input });
    }),

  // Get paginated permissions (protected)
  getPaginated: protectedProcedure.input(getPermissionsInputSchema).query(async ({ input }) => {
    return permissionService.getAllPermissions(input);
  }),

  // Get permission by ID (protected)
  getById: protectedProcedure.input(getPermissionByIdInputSchema).query(async ({ input }) => {
    return permissionService.getPermissionById(input.id);
  }),

  // Get permission by key (public - for permission checking)
  getByKey: publicProcedure.input(getPermissionByKeyInputSchema).query(async ({ input }) => {
    return permissionService.getPermissionByKey(input.key);
  }),

  // Update permission (protected)
  update: protectedProcedure.input(updatePermissionInputSchema).mutation(async ({ input }) => {
    return permissionService.updatePermission(input.id, input.data);
  }),

  // Delete permission (protected)
  delete: protectedProcedure.input(deletePermissionInputSchema).mutation(async ({ input }) => {
    return permissionService.deletePermission(input.id);
  }),

  // Search permissions (protected)
  search: protectedProcedure.input(searchPermissionsInputSchema).query(async ({ input }) => {
    return permissionService.searchPermissions(input.query, input.filters);
  }),

  // Bulk create permissions (protected)
  bulkCreate: protectedProcedure
    .input(bulkCreatePermissionsInputSchema)
    .mutation(async ({ input }) => {
      return permissionService.bulkCreatePermissions(input.permissions);
    }),

  // Export permissions (protected)
  export: protectedProcedure.input(exportPermissionsInputSchema).query(async ({ input }) => {
    return permissionService.exportPermissions(input.format);
  }),

  // Check if user has permission (public - for authorization)
  checkPermission: publicProcedure.input(checkPermissionInputSchema).query(async ({ input }) => {
    return permissionService.checkPermission(input.userRoles, input.permissionKey);
  }),

  // Get suggested permissions (protected)
  getSuggested: protectedProcedure
    .input(getSuggestedPermissionsInputSchema)
    .query(async ({ input }) => {
      return permissionService.getSuggestedPermissions(input);
    }),

  // Get permissions by module (protected)
  getByModule: protectedProcedure
    .input(getPermissionsByModuleInputSchema)
    .query(async ({ input }) => {
      // For now, return all permissions filtered by module in the service
      return permissionService.getAllPermissions({
        module: input.module,
        page: 1,
        limit: 100,
        sortBy: 'name',
        sortOrder: 'asc',
      });
    }),

  // Get permissions by resource (protected)
  getByResource: protectedProcedure
    .input(getPermissionsByResourceInputSchema)
    .query(async ({ input }) => {
      // For now, return all permissions filtered by resource in the service
      return permissionService.getAllPermissions({
        resource: input.resource,
        page: 1,
        limit: 100,
        sortBy: 'name',
        sortOrder: 'asc',
      });
    }),

  // Get permissions by category (protected)
  getByCategory: protectedProcedure
    .input(getPermissionsByCategoryInputSchema)
    .query(async ({ input }) => {
      // For now, return all permissions filtered by category in the service
      return permissionService.getAllPermissions({
        category: input.category,
        page: 1,
        limit: 100,
        sortBy: 'name',
        sortOrder: 'asc',
      });
    }),

  // Get permission categories (protected)
  getCategories: protectedProcedure.query(async () => {
    return permissionService.getPermissionsByModule();
  }),

  // Get permission resources (protected)
  getResources: protectedProcedure.query(async () => {
    return permissionService.getPermissionsByResource();
  }),

  // Validate permission hierarchy (protected)
  validateHierarchy: protectedProcedure
    .input(validatePermissionHierarchyInputSchema)
    .query(async ({ input }) => {
      return permissionService.validatePermissionHierarchy(input.permissionKey);
    }),

  // Get permission statistics (protected)
  getStats: protectedProcedure.query(async () => {
    return permissionService.getPermissionStats();
  }),

  // Get permission statistics (alias for compatibility)
  getStatistics: protectedProcedure.query(async () => {
    return permissionService.getPermissionStats();
  }),

  // Initialize system permissions (protected)
  initializeSystem: protectedProcedure.mutation(async () => {
    return permissionService.initializeSystemPermissions();
  }),
});
