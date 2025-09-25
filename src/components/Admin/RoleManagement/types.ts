import type { RouterOutputs } from '@/trpc/shared';

export type Role = NonNullable<RouterOutputs['roles']['getAll']['data']>[number];

export type RoleFormData = Pick<
  Role,
  | 'key'
  | 'name'
  | 'description'
  | 'type'
  | 'level'
  | 'priority'
  | 'permissions'
  | 'inheritsFrom'
  | 'isActive'
  | 'maxMembers'
  | 'conditions'
  | 'metadata'
>;

export type RoleManagementProps = {
  organizationId?: string;
};

export type RoleFilter = {
  search?: string;
  type?: Role['type'];
  level?: Role['level'];
  isActive?: string; // 'true' | 'false' | undefined
  isSystemDefined?: boolean;
};
