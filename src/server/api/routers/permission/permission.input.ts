import { z } from 'zod';

import {
  permissionBaseSchema,
  permissionFilterSchema,
  permissionUpdateSchema,
} from '@/validations/permission.validation';

// Input schemas for permission operations
export const createPermissionInputSchema = permissionBaseSchema;

export type CreatePermissionInputSchema = z.infer<typeof createPermissionInputSchema>;

export const getPermissionsInputSchema = permissionFilterSchema;

export type GetPermissionsInputSchema = z.infer<typeof getPermissionsInputSchema>;

export const updatePermissionInputSchema = z.object({
  id: z.string().min(1, 'Permission ID is required'),
  data: permissionUpdateSchema,
});

export type UpdatePermissionInputSchema = z.infer<typeof updatePermissionInputSchema>;

export const deletePermissionInputSchema = z.object({
  id: z.string().min(1, 'Permission ID is required'),
});

export type DeletePermissionInputSchema = z.infer<typeof deletePermissionInputSchema>;

export const getPermissionByIdInputSchema = z.object({
  id: z.string().min(1, 'Permission ID is required'),
});

export type GetPermissionByIdInputSchema = z.infer<typeof getPermissionByIdInputSchema>;

export const getPermissionByKeyInputSchema = z.object({
  key: z.string().min(1, 'Permission key is required'),
});

export type GetPermissionByKeyInputSchema = z.infer<typeof getPermissionByKeyInputSchema>;

export const searchPermissionsInputSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: permissionFilterSchema.partial().optional(),
});

export type SearchPermissionsInputSchema = z.infer<typeof searchPermissionsInputSchema>;

export const bulkCreatePermissionsInputSchema = z.object({
  permissions: z.array(permissionBaseSchema).min(1, 'At least one permission is required'),
});

export type BulkCreatePermissionsInputSchema = z.infer<typeof bulkCreatePermissionsInputSchema>;

export const exportPermissionsInputSchema = z.object({
  format: z.enum(['json', 'csv', 'excel']).default('json'),
});

export type ExportPermissionsInputSchema = z.infer<typeof exportPermissionsInputSchema>;

export const checkPermissionInputSchema = z.object({
  userRoles: z.array(z.string()).min(1, 'At least one role is required'),
  permissionKey: z.string().min(1, 'Permission key is required'),
});

export type CheckPermissionInputSchema = z.infer<typeof checkPermissionInputSchema>;

export const getSuggestedPermissionsInputSchema = z.object({
  module: permissionBaseSchema.shape.module.optional(),
  resource: permissionBaseSchema.shape.resource.optional(),
  role: z.string().optional(),
});

export type GetSuggestedPermissionsInputSchema = z.infer<typeof getSuggestedPermissionsInputSchema>;

export const getPermissionsByModuleInputSchema = permissionBaseSchema.pick({
  module: true,
});

export type GetPermissionsByModuleInputSchema = z.infer<typeof getPermissionsByModuleInputSchema>;

export const getPermissionsByResourceInputSchema = permissionBaseSchema.pick({
  resource: true,
});

export type GetPermissionsByResourceInputSchema = z.infer<
  typeof getPermissionsByResourceInputSchema
>;

export const getPermissionsByCategoryInputSchema = permissionBaseSchema.pick({
  category: true,
});

export type GetPermissionsByCategoryInputSchema = z.infer<
  typeof getPermissionsByCategoryInputSchema
>;

export const validatePermissionHierarchyInputSchema = z.object({
  permissionKey: z.string().min(1, 'Permission key is required'),
});

export type ValidatePermissionHierarchyInputSchema = z.infer<
  typeof validatePermissionHierarchyInputSchema
>;
