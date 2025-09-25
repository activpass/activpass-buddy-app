import type { RouterOutputs } from '@/trpc/shared';

export type EmployeeData = RouterOutputs['employees']['list']['employees'][number];
export type EmployeeListResponse = RouterOutputs['employees']['list'];
