import type {
  CreateMembershipPlanInputSchema,
  UpdateMembershipPlanInputSchema,
} from '../membership-plan.input';
import type { IMembershipPlanSchema } from '../model/membership-plan.model';

export type ListMembershipPlansParams = {
  orgId: string;
};

export type GetMembershipPlanParams = {
  id: IMembershipPlanSchema['id'];
};

export type CreateMembershipPlanParams = {
  orgId: string;
  data: CreateMembershipPlanInputSchema;
};

export type UpdateMembershipPlanParams = {
  id: IMembershipPlanSchema['id'];
  data: UpdateMembershipPlanInputSchema['data'];
};

export type DeleteMembershipPlanParams = {
  id: IMembershipPlanSchema['id'];
};
