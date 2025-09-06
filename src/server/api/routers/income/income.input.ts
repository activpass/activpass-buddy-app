import { convertObjectKeysIntoZodEnum } from '@paalan/react-shared/lib';
import { z } from 'zod';

import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
import { clientFormSchema } from '@/validations/client/add-form.validation';

export const createIncomeInputSchema = clientFormSchema.shape.paymentDetail.extend({
  invoiceId: z.string(),
  organization: z.string(),
  amount: z.number(),
  client: z.string().optional(),
  membershipPlan: z.string().optional(),
  date: z.string().optional(),
  dueDate: z.string().optional(),
  tenure: convertObjectKeysIntoZodEnum(CLIENT_MEMBERSHIP_TENURE).optional(),
  notes: z.string().optional(),
});
export type CreateIncomeInputSchema = z.infer<typeof createIncomeInputSchema>;

export const updateIncomeInputSchema = z.object({
  id: z.string(),
  data: createIncomeInputSchema.optional(),
});
export type UpdateIncomeInputSchema = z.infer<typeof updateIncomeInputSchema>;

export const listIncomeInputSchema = z.object({
  clientId: z.string().optional(),
});
export type ListIncomeInputSchema = z.infer<typeof listIncomeInputSchema>;

export const getUserCacheByIdInputSchema = z.object({
  id: z.string().min(1, {
    message: 'Income ID is required',
  }),
});
export type GetByIdInputSchema = z.infer<typeof getUserCacheByIdInputSchema>;
