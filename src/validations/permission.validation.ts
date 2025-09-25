import { z } from 'zod';

// Permission pattern "module:resource:action" format
// Examples: "user:profile:read", "admin:users:create", "billing:invoices:manage"

// Define enums for better type safety and validation
const PermissionModuleEnum = z.enum([
  'user',
  'admin',
  'billing',
  'content',
  'analytics',
  'system',
  'organization',
  'security',
  'support',
  'inventory',
  'sales',
  'marketing',
  'hr',
  'finance',
  'checkin',
  'checkout',
  'client',
  'employee',
  'role',
  'permission',
]);

const PermissionResourceEnum = z.enum([
  'profile',
  'users',
  'roles',
  'permissions',
  'organizations',
  'memberships',
  'billing',
  'invoices',
  'payments',
  'subscriptions',
  'content',
  'posts',
  'pages',
  'media',
  'analytics',
  'reports',
  'dashboard',
  'system',
  'settings',
  'configuration',
  'security',
  'audit_logs',
  'support',
  'tickets',
  'inventory',
  'products',
  'sales',
  'orders',
  'marketing',
  'campaigns',
  'hr',
  'employees',
  'finance',
  'transactions',
  'checkins',
  'checkouts',
  'tokens',
  'clients',
  'client_profiles',
]);

const PermissionActionEnum = z.enum(['create', 'read', 'update', 'delete', 'manage']);

const PermissionCategoryEnum = z.enum([
  'USER_MANAGEMENT',
  'CONTENT_MANAGEMENT',
  'SYSTEM_ADMINISTRATION',
  'REPORTING_ANALYTICS',
  'SECURITY_COMPLIANCE',
  'BILLING_FINANCE',
  'ORGANIZATION_MANAGEMENT',
  'SUPPORT_OPERATIONS',
  'INVENTORY_MANAGEMENT',
  'SALES_MARKETING',
  'HR_MANAGEMENT',
  'CLIENT_MANAGEMENT',
  'CHECKIN_CHECKOUT',
]);

// Base permission schema for creation
export const permissionBaseSchema = z.object({
  // The permission key following "module:resource:action" pattern
  key: z
    .string()
    .regex(
      /^[a-z_]+:[a-z_]+:[a-z_]+$/,
      'Permission key must follow the pattern "module:resource:action" (e.g., "user:profile:read")'
    )
    .trim()
    .toLowerCase(),

  // Human-readable name
  name: z
    .string()
    .min(3, 'Permission name must be at least 3 characters')
    .max(100, 'Permission name must not exceed 100 characters')
    .trim(),

  // Optional description
  description: z.string().max(500, 'Description must not exceed 500 characters').trim().optional(),

  // Extracted from the key for easier querying and validation
  module: PermissionModuleEnum,
  resource: PermissionResourceEnum,
  action: PermissionActionEnum,

  // Category for grouping permissions in UI
  category: PermissionCategoryEnum,

  // Priority level (1-10, where 1 is highest priority)
  priority: z
    .number()
    .int()
    .min(1, 'Priority must be at least 1')
    .max(10, 'Priority must not exceed 10')
    .default(5),

  // Conditions for attribute-based access control (ABAC)
  conditions: z
    .record(z.string(), z.any())
    .optional()
    .describe('Additional conditions for ABAC evaluation'),

  // Metadata for extensibility
  metadata: z
    .record(z.string(), z.any())
    .optional()
    .describe('Additional metadata for the permission'),

  // Status flags
  isActive: z.boolean().default(true),
  isSystemDefined: z.boolean().default(false),

  // Organization context (optional for multi-tenant systems)
  organization: z.string().optional(),
});

// Full permission schema including timestamps and id
export const permissionSchema = permissionBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for permission updates (all fields optional except id)
export const permissionUpdateSchema = permissionBaseSchema.partial();

// Schema for permission filtering/querying
export const permissionFilterSchema = z.object({
  search: z.string().optional(),
  module: PermissionModuleEnum.optional(),
  resource: PermissionResourceEnum.optional(),
  action: PermissionActionEnum.optional(),
  category: PermissionCategoryEnum.optional(),
  isActive: z.boolean().optional(),
  isSystemDefined: z.boolean().optional(),
  organizationId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'key', 'category', 'priority', 'createdAt', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Custom validation to ensure key matches extracted components
const validatePermissionKey = z
  .object({
    key: z.string(),
    module: PermissionModuleEnum,
    resource: PermissionResourceEnum,
    action: PermissionActionEnum,
  })
  .refine(
    data => {
      const keyParts = data.key.split(':');
      return (
        keyParts.length === 3 &&
        keyParts[0] === data.module &&
        keyParts[1] === data.resource &&
        keyParts[2] === data.action
      );
    },
    {
      message:
        'Permission key must match the module:resource:action format with the provided components',
      path: ['key'],
    }
  );

// Enhanced permission schema with key validation
export const permissionWithValidationSchema = permissionBaseSchema.and(validatePermissionKey);

// Type inference from Zod schemas
export type IPermissionBase = z.infer<typeof permissionBaseSchema>;
export type IPermissionSchema = z.infer<typeof permissionSchema>;
export type IPermissionUpdate = z.infer<typeof permissionUpdateSchema>;
export type IPermissionFilter = z.infer<typeof permissionFilterSchema>;
export type PermissionModule = z.infer<typeof PermissionModuleEnum>;
export type PermissionResource = z.infer<typeof PermissionResourceEnum>;
export type PermissionAction = z.infer<typeof PermissionActionEnum>;
export type PermissionCategory = z.infer<typeof PermissionCategoryEnum>;

// Utility function to generate permission key
export const generatePermissionKey = (
  module: PermissionModule,
  resource: PermissionResource,
  action: PermissionAction
): string => {
  return `${module}:${resource}:${action}`;
};

// Utility function to parse permission key
export const parsePermissionKey = (
  key: string
): {
  module: string;
  resource: string;
  action: string;
} | null => {
  const parts = key.split(':');
  if (parts.length !== 3) return null;

  return {
    module: parts[0]!,
    resource: parts[1]!,
    action: parts[2]!,
  };
};

// Default system permissions based on system permissions
export const DEFAULT_SYSTEM_PERMISSIONS: Partial<IPermissionBase>[] = [
  // Organization management
  {
    key: 'organization:profile:manage',
    name: 'Manage Organization',
    description: 'Full access to manage organization profile and settings',
    module: 'organization',
    resource: 'profile',
    action: 'manage',
    category: 'ORGANIZATION_MANAGEMENT',
    priority: 1,
    isSystemDefined: true,
  },
  {
    key: 'organization:profile:delete',
    name: 'Delete Organization',
    description: 'Permission to delete the organization',
    module: 'organization',
    resource: 'profile',
    action: 'delete',
    category: 'ORGANIZATION_MANAGEMENT',
    priority: 1,
    isSystemDefined: true,
  },

  // Member management
  {
    key: 'organization:memberships:read',
    name: 'Read Members',
    description: 'View organization members and their details',
    module: 'organization',
    resource: 'memberships',
    action: 'read',
    category: 'USER_MANAGEMENT',
    priority: 2,
    isSystemDefined: true,
  },
  {
    key: 'organization:memberships:manage',
    name: 'Manage Members',
    description: 'Full access to manage organization memberships',
    module: 'organization',
    resource: 'memberships',
    action: 'manage',
    category: 'USER_MANAGEMENT',
    priority: 1,
    isSystemDefined: true,
  },

  // Billing management
  {
    key: 'organization:billing:read',
    name: 'Read Billing',
    description: 'View billing information and history',
    module: 'organization',
    resource: 'billing',
    action: 'read',
    category: 'BILLING_FINANCE',
    priority: 3,
    isSystemDefined: true,
  },
  {
    key: 'organization:billing:manage',
    name: 'Manage Billing',
    description: 'Full access to manage billing and payments',
    module: 'organization',
    resource: 'billing',
    action: 'manage',
    category: 'BILLING_FINANCE',
    priority: 2,
    isSystemDefined: true,
  },

  // User management
  {
    key: 'user:users:create',
    name: 'Create Users',
    description: 'Create new user accounts',
    module: 'user',
    resource: 'users',
    action: 'create',
    category: 'USER_MANAGEMENT',
    priority: 2,
    isSystemDefined: true,
  },
  {
    key: 'user:users:read',
    name: 'Read Users',
    description: 'View user profiles and information',
    module: 'user',
    resource: 'users',
    action: 'read',
    category: 'USER_MANAGEMENT',
    priority: 3,
    isSystemDefined: true,
  },
  {
    key: 'user:users:update',
    name: 'Update Users',
    description: 'Edit user profiles and information',
    module: 'user',
    resource: 'users',
    action: 'update',
    category: 'USER_MANAGEMENT',
    priority: 2,
    isSystemDefined: true,
  },
  {
    key: 'user:users:delete',
    name: 'Delete Users',
    description: 'Remove user accounts',
    module: 'user',
    resource: 'users',
    action: 'delete',
    category: 'USER_MANAGEMENT',
    priority: 1,
    isSystemDefined: true,
  },
];
