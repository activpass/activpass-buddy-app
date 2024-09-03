import { z } from 'zod';

import { createMembershipPlanSchema } from '@/validations/client/membership.validation';

export const getMembershipPlanInputSchema = z.object({
  id: z.string(),
});
export type GetMembershipPlanInputSchema = z.infer<typeof getMembershipPlanInputSchema>;

export const createMembershipPlanInputSchema = createMembershipPlanSchema;
export type CreateMembershipPlanInputSchema = z.infer<typeof createMembershipPlanInputSchema>;

export const updateMembershipPlanInputSchema = z.object({
  id: z.string(),
  data: createMembershipPlanInputSchema.optional(),
});
export type UpdateMembershipPlanInputSchema = z.infer<typeof updateMembershipPlanInputSchema>;

export const deleteMembershipPlanInputSchema = z.object({
  id: z.string(),
});
export type DeleteMembershipPlanInputSchema = z.infer<typeof deleteMembershipPlanInputSchema>;
