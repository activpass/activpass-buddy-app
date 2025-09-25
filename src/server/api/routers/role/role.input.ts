import { z } from 'zod';

import { roleBaseSchema, roleFilterSchema, roleUpdateSchema } from '@/validations/role.validation';

// Input schemas for role operations
export const createRoleInputSchema = roleBaseSchema;

export type CreateRoleInputSchema = z.infer<typeof createRoleInputSchema>;

export const getRolesInputSchema = roleFilterSchema;

export type GetRolesInputSchema = z.infer<typeof getRolesInputSchema>;

export const updateRoleInputSchema = z.object({
  id: z.string().min(1, 'Role ID is required'),
  data: roleUpdateSchema,
});

export type UpdateRoleInputSchema = z.infer<typeof updateRoleInputSchema>;

export const deleteRoleInputSchema = z.object({
  id: z.string().min(1, 'Role ID is required'),
});

export type DeleteRoleInputSchema = z.infer<typeof deleteRoleInputSchema>;

export const getRoleByIdInputSchema = z.object({
  id: z.string().min(1, 'Role ID is required'),
});

export type GetRoleByIdInputSchema = z.infer<typeof getRoleByIdInputSchema>;

export const getRoleByNameInputSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
});

export type GetRoleByNameInputSchema = z.infer<typeof getRoleByNameInputSchema>;

export const assignPermissionsInputSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  permissionIds: z.array(z.string()).min(1, 'At least one permission ID is required'),
});

export type AssignPermissionsInputSchema = z.infer<typeof assignPermissionsInputSchema>;

export const removePermissionsInputSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  permissionIds: z.array(z.string()).min(1, 'At least one permission ID is required'),
});

export type RemovePermissionsInputSchema = z.infer<typeof removePermissionsInputSchema>;

export const getEffectivePermissionsInputSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
});

export type GetEffectivePermissionsInputSchema = z.infer<typeof getEffectivePermissionsInputSchema>;

export const cloneRoleInputSchema = z.object({
  sourceRoleId: z.string().min(1, 'Source role ID is required'),
  newRoleName: z.string().min(1, 'New role name is required'),
  newRoleKey: z.string().optional(),
  newRoleDescription: z.string().optional(),
});

export type CloneRoleInputSchema = z.infer<typeof cloneRoleInputSchema>;

export const compareRolesInputSchema = z.object({
  roleId1: z.string().min(1, 'First role ID is required'),
  roleId2: z.string().min(1, 'Second role ID is required'),
});

export type CompareRolesInputSchema = z.infer<typeof compareRolesInputSchema>;

export const getRoleHierarchyInputSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
});

export type GetRoleHierarchyInputSchema = z.infer<typeof getRoleHierarchyInputSchema>;

export const validateRoleHierarchyInputSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  parentRoleId: z.string().optional(),
});

export type ValidateRoleHierarchyInputSchema = z.infer<typeof validateRoleHierarchyInputSchema>;

export const getRolesByTypeInputSchema = z.object({
  type: z.string().min(1, 'Role type is required'),
});

export type GetRolesByTypeInputSchema = z.infer<typeof getRolesByTypeInputSchema>;

export const getRolesByLevelInputSchema = z.object({
  level: z.string().min(1, 'Role level is required'),
});

export type GetRolesByLevelInputSchema = z.infer<typeof getRolesByLevelInputSchema>;

export const getRolesByCreatorInputSchema = z.object({
  createdBy: z.string().min(1, 'Creator ID is required'),
});

export type GetRolesByCreatorInputSchema = z.infer<typeof getRolesByCreatorInputSchema>;

export const searchRolesInputSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: roleFilterSchema.partial().optional(),
});

export type SearchRolesInputSchema = z.infer<typeof searchRolesInputSchema>;

export const bulkCreateRolesInputSchema = z.object({
  roles: z.array(roleBaseSchema).min(1, 'At least one role is required'),
});

export type BulkCreateRolesInputSchema = z.infer<typeof bulkCreateRolesInputSchema>;

export const exportRolesInputSchema = z.object({
  format: z.enum(['json', 'csv', 'excel']).default('json'),
});

export type ExportRolesInputSchema = z.infer<typeof exportRolesInputSchema>;

export const checkRolePermissionInputSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  permissionKey: z.string().min(1, 'Permission key is required'),
});

export type CheckRolePermissionInputSchema = z.infer<typeof checkRolePermissionInputSchema>;

export const getSuggestedRolesInputSchema = z.object({
  permissions: z.array(z.string()).optional(),
  type: z.string().optional(),
  level: z.string().optional(),
});

export type GetSuggestedRolesInputSchema = z.infer<typeof getSuggestedRolesInputSchema>;
