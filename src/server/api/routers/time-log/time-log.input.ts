import { z } from 'zod';

import { checkInFormSchema } from '@/validations/check-in/form.validation';

export const createTimeLogInputSchema = z.object({
  clientId: z.string(),
  checkIn: z.date(),
  checkOut: z.date().nullish(),
});
export type CreateTimeLogInputSchema = z.infer<typeof createTimeLogInputSchema>;

export const updateTimeLogInputSchema = z.object({
  id: z.string(),
  data: createTimeLogInputSchema.partial(),
});
export type UpdateTimeLogInputSchema = z.infer<typeof updateTimeLogInputSchema>;

export const listTimeLogInputSchema = z.object({
  clientId: z.string().optional(),
});
export type ListTimeLogInputSchema = z.infer<typeof listTimeLogInputSchema>;

export const getTimeLogByClientIdWithDateRangeInputSchema = z.object({
  clientId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});
export type GetTimeLogByClientIdWithDateRangeInputSchema = z.infer<
  typeof getTimeLogByClientIdWithDateRangeInputSchema
>;

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
