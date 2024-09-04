import { z } from 'zod';

import { checkInFormSchema } from '@/validations/check-in/form.validation';

export const createCheckInInputSchema = z.object({});
export type CreateCheckInInputSchema = z.infer<typeof createCheckInInputSchema>;

export const updateCheckInInputSchema = z.object({
  id: z.string(),
  data: createCheckInInputSchema.optional(),
});
export type UpdateCheckInInputSchema = z.infer<typeof updateCheckInInputSchema>;

export const listCheckInInputSchema = z.object({
  clientId: z.string().optional(),
});

export const clientCheckInInputSchema = checkInFormSchema.extend({
  orgId: z.string().min(1, {
    message: 'Organization ID is required',
  }),
});
export type ClientCheckInInputSchema = z.infer<typeof clientCheckInInputSchema>;

export const clientCheckInVerifyInputSchema = clientCheckInInputSchema.extend({
  pin: z.number().min(1, {
    message: 'Pin is required',
  }),
});
export type ClientCheckInVerifyInputSchema = z.infer<typeof clientCheckInVerifyInputSchema>;

export const clientCheckOutInputSchema = clientCheckInInputSchema;
export type ClientCheckOutInputSchema = z.infer<typeof clientCheckOutInputSchema>;

export const clientCheckOutVerifyInputSchema = clientCheckInVerifyInputSchema;
export type ClientCheckOutVerifyInputSchema = z.infer<typeof clientCheckOutVerifyInputSchema>;
