import type { RouterOutputs } from '@/trpc/shared';

export type Permission = NonNullable<RouterOutputs['permissions']['getAll']['data']>[number];

export type PermissionFormData = Pick<
  Permission,
  | 'key'
  | 'name'
  | 'description'
  | 'module'
  | 'resource'
  | 'action'
  | 'category'
  | 'priority'
  | 'isActive'
  | 'conditions'
  | 'metadata'
>;
