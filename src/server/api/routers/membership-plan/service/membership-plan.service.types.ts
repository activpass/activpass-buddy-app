import type {
  CreateMembershipPlanInputSchema,
  UpdateMembershipPlanInputSchema,
} from '../membership-plan.input';

export type GetMembershipPlanByIdArgs = {
  id: string;
};

export type CreateMembershipPlanArgs = {
  orgId: string;
  input: CreateMembershipPlanInputSchema;
};

export type UpdateMembershipPlanArgs = {
  input: UpdateMembershipPlanInputSchema;
};

export type ListMembershipPlansArgs = {
  orgId: string;
};
