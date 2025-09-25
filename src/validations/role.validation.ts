import { z } from 'zod';

// Role pattern following the conventions
// Examples: "org:admin", "org:member", "org:billing", "org:moderator"

// Define enums for better type safety
export const RoleTypeEnum = z.enum([
  'SYSTEM', // System-defined roles like admin, member
  'ORGANIZATION', // Organization-specific roles
  'CUSTOM', // Custom roles created by users
]);

export const RoleLevelEnum = z.enum([
  'SUPER_ADMIN', // Level 1 - Highest privileges
  'ADMIN', // Level 2 - Administrative privileges
  'MANAGER', // Level 3 - Management privileges
  'EMPLOYEE', // Level 4 - Standard employee privileges
  'VIEWER', // Level 5 - Read-only access
]);

// Base role schema for creation
export const roleBaseSchema = z.object({
  // Role key following convention (e.g., "org:admin", "org:billing")
  key: z
    .string()
    .regex(
      /^[a-z_]+:[a-z_]+$/,
      'Role key must follow the pattern "namespace:role" (e.g., "sys:admin", "org:admin")'
    )
    .trim()
    .toLowerCase(),

  // Human-readable name
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(100, 'Role name must not exceed 100 characters')
    .trim(),

  // Optional description
  description: z.string().max(500, 'Description must not exceed 500 characters').trim().optional(),

  // Role type
  type: RoleTypeEnum.default('CUSTOM'),

  // Role level for hierarchical permissions
  level: RoleLevelEnum.default('EMPLOYEE'),

  // Numerical priority (1-100, where 1 is highest priority)
  priority: z
    .number()
    .int()
    .min(1, 'Priority must be at least 1')
    .max(100, 'Priority must not exceed 100')
    .default(50),

  // Associated permission IDs
  permissions: z
    .array(z.string())
    .default([])
    .describe('Array of permission IDs associated with this role'),

  // Inherited roles (for role hierarchy)
  inheritsFrom: z
    .array(z.string())
    .default([])
    .describe('Array of role IDs that this role inherits permissions from'),

  // Conditions for role assignment/access (ABAC)
  conditions: z.any().optional().describe('Conditions for role assignment and access control'),

  // Metadata for extensibility
  metadata: z.any().optional().describe('Additional metadata for the role'),

  // Status flags
  isActive: z.boolean().default(true),
  isSystemDefined: z.boolean().default(false),
  isCreatorRole: z.boolean().default(false), // Creator role concept
  isDefaultRole: z.boolean().default(false), // Default role concept

  // Organization context (for multi-tenant systems)
  organization: z.string().optional(),

  // Role constraints
  maxMembers: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Maximum number of users that can have this role'),

  // Time-based constraints
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
});

// Full role schema including timestamps and id
export const roleSchema = roleBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  memberCount: z.number().int().default(0), // Virtual field for number of users with this role
});

// Schema for role updates (all fields optional except id)
export const roleUpdateSchema = roleBaseSchema.partial();

// Schema for role filtering/querying
export const roleFilterSchema = z.object({
  search: z.string().optional(),
  type: RoleTypeEnum.optional(),
  level: RoleLevelEnum.optional(),
  isActive: z.boolean().optional(),
  isSystemDefined: z.boolean().optional(),
  isCreatorRole: z.boolean().optional(),
  isDefaultRole: z.boolean().optional(),
  organizationId: z.string().optional(),
  hasPermissions: z.boolean().optional(), // Filter roles with/without permissions
  permissionId: z.string().optional(), // Filter roles with specific permission
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(['name', 'key', 'type', 'level', 'priority', 'memberCount', 'createdAt', 'updatedAt'])
    .default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Schema for role permission assignment
export const rolePermissionAssignmentSchema = z.object({
  roleId: z.string(),
  permissionIds: z.array(z.string()),
  action: z.enum(['add', 'remove', 'replace']).default('replace'),
});

// Schema for role inheritance
export const roleInheritanceSchema = z.object({
  roleId: z.string(),
  parentRoleIds: z.array(z.string()),
  action: z.enum(['add', 'remove', 'replace']).default('replace'),
});

// Custom validation for role hierarchy (prevent circular inheritance)
export const validateRoleHierarchy = z
  .object({
    roleId: z.string(),
    inheritsFrom: z.array(z.string()),
  })
  .refine(data => !data.inheritsFrom.includes(data.roleId), {
    message: 'Role cannot inherit from itself',
    path: ['inheritsFrom'],
  });

// Type inference from Zod schemas
export type IRoleBase = z.infer<typeof roleBaseSchema>;
export type IRoleSchema = z.infer<typeof roleSchema>;
export type IRoleUpdate = z.infer<typeof roleUpdateSchema>;
export type IRoleFilter = z.infer<typeof roleFilterSchema>;
export type IRolePermissionAssignment = z.infer<typeof rolePermissionAssignmentSchema>;
export type IRoleInheritance = z.infer<typeof roleInheritanceSchema>;
export type RoleType = z.infer<typeof RoleTypeEnum>;
export type RoleLevel = z.infer<typeof RoleLevelEnum>;

// Utility function to generate role key
export const generateRoleKey = (namespace: string, role: string): string => {
  return `${namespace}:${role}`;
};

// Utility function to parse role key
export const parseRoleKey = (
  key: string
): {
  namespace: string;
  role: string;
} | null => {
  const parts = key.split(':');
  if (parts.length !== 2) return null;

  return {
    namespace: parts[0]!,
    role: parts[1]!,
  };
};

// Utility function to get role level priority (for hierarchy)
export const getRoleLevelPriority = (level: RoleLevel): number => {
  const priorities: Record<RoleLevel, number> = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    MANAGER: 3,
    EMPLOYEE: 4,
    VIEWER: 5,
  };
  return priorities[level];
};

export const DEFAULT_SYSTEM_ROLE_KEY = {
  SUPER_ADMIN: 'sys:super_admin',
  ADMIN: 'sys:admin',
  MANAGER: 'sys:manager',
  EMPLOYEE: 'sys:employee',
  VIEWER: 'sys:viewer',
} as const;

// Default system roles based on default roles
export const DEFAULT_SYSTEM_ROLES: Partial<IRoleBase>[] = [
  {
    key: DEFAULT_SYSTEM_ROLE_KEY.SUPER_ADMIN,
    name: 'Super Admin',
    description: 'Full access to all system resources and settings.',
    type: 'SYSTEM',
    level: RoleLevelEnum.enum.SUPER_ADMIN,
    priority: getRoleLevelPriority(RoleLevelEnum.enum.SUPER_ADMIN),
    isSystemDefined: true,
    isCreatorRole: true, // Default creator role
    permissions: [], // Will be populated with system permissions
  },
  {
    key: DEFAULT_SYSTEM_ROLE_KEY.ADMIN,
    name: 'Administrator',
    description: 'Full access to organization resources. Can manage organization and memberships.',
    type: 'SYSTEM',
    level: RoleLevelEnum.enum.ADMIN,
    priority: getRoleLevelPriority(RoleLevelEnum.enum.ADMIN),
    isSystemDefined: true,
    permissions: [], // Will be populated with system permissions
  },
  {
    key: DEFAULT_SYSTEM_ROLE_KEY.MANAGER,
    name: 'Manager',
    description: 'Can manage teams and projects but cannot access billing or admin settings.',
    type: 'SYSTEM',
    level: RoleLevelEnum.enum.MANAGER,
    priority: getRoleLevelPriority(RoleLevelEnum.enum.MANAGER),
    isSystemDefined: true,
    permissions: [], // Will be populated with management permissions
  },
  {
    key: DEFAULT_SYSTEM_ROLE_KEY.EMPLOYEE,
    name: 'Employee',
    description: 'Standard employee role with access to assigned resources.',
    type: 'SYSTEM',
    level: RoleLevelEnum.enum.EMPLOYEE,
    priority: getRoleLevelPriority(RoleLevelEnum.enum.EMPLOYEE),
    isSystemDefined: true,
    isDefaultRole: true, // Default role for new members
    permissions: [], // Will be populated with employee permissions
  },
  {
    key: DEFAULT_SYSTEM_ROLE_KEY.VIEWER,
    name: 'Viewer',
    description: 'Read-only access to system information.',
    type: 'SYSTEM',
    level: RoleLevelEnum.enum.VIEWER,
    priority: getRoleLevelPriority(RoleLevelEnum.enum.VIEWER),
    isSystemDefined: true,
    permissions: [], // Will be populated with read-only permissions
  },
];
