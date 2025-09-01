import { convertObjectKeysIntoZodEnum } from '@paalan/react-shared/lib';
import { z } from 'zod';

import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';

export const createMembershipPlanSchema = z.object({
  name: z.string().min(1, {
    message: 'Plan name is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  tenure: convertObjectKeysIntoZodEnum(CLIENT_MEMBERSHIP_TENURE),
  amount: z
    .number({
      message: 'Amount is required',
    })
    .min(1, {
      message: 'Amount is required',
    }),
  features: z
    .array(
      z.object({
        value: z.string().trim().min(1, {
          message: 'Feature value is required',
        }),
      })
    )
    .optional(),
  discountPercentage: z.number().int().min(0).max(100).nullish(),
});
export type CreateMembershipPlanSchema = z.infer<typeof createMembershipPlanSchema>;

export const updateMembershipPlanSchema = createMembershipPlanSchema.extend({
  id: z.string(),
});
export type UpdateMembershipPlanSchema = z.infer<typeof updateMembershipPlanSchema>;
