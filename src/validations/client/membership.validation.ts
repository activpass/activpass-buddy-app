import { z } from 'zod';

import { MEMBERSHIP_TENURE_DISPLAY_ITEM } from '@/constants/client/membership';
import { convertObjectKeysIntoZodEnum } from '@/utils/helpers';

export const createMembershipPlanSchema = z.object({
  planName: z.string().min(1, {
    message: 'Plan name is required',
  }),
  tenure: convertObjectKeysIntoZodEnum(MEMBERSHIP_TENURE_DISPLAY_ITEM),
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
        value: z.string().min(1, {
          message: 'Feature name is required',
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
