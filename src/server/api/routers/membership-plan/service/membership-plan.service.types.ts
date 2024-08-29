import type {
  CreateMembershipPlanInputSchema,
  DeleteMembershipPlanInputSchema,
  GetMembershipPlanInputSchema,
  UpdateMembershipPlanInputSchema,
} from '../membership-plan.input';

export type ListMembershipPlanArgs = {
  orgId: string;
};

export type GetMembershipPlanArgs = {
  input: GetMembershipPlanInputSchema;
};

export type CreateMembershipPlanArgs = {
  orgId: string;
  input: CreateMembershipPlanInputSchema;
};

export type UpdateMembershipPlanArgs = {
  input: UpdateMembershipPlanInputSchema;
};

export type DeleteMembershipPlanArgs = {
  input: DeleteMembershipPlanInputSchema;
};
