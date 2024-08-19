import { z } from 'zod';

export const createMembershipPlanInputSchema = z.object({
  planName: z.string({ required_error: 'Plan name is required' }).min(1, {
    message: 'Plan name is required',
  }),
  tenure: z.string({ required_error: 'Tenure is required' }).min(1, {
    message: 'Tenure is required',
  }),
  amount: z.number({ required_error: 'Amount is required' }),
  features: z.string({ required_error: 'Features is required' }),
  discountPercentage: z.number().optional(),
});
export type CreateMembershipPlanInputSchema = z.infer<typeof createMembershipPlanInputSchema>;

export const updateMembershipPlanInputSchema = z.object({
  id: z.string(),
  data: createMembershipPlanInputSchema.optional(),
});
export type UpdateMembershipPlanInputSchema = z.infer<typeof updateMembershipPlanInputSchema>;
