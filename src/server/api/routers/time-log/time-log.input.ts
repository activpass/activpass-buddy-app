import { z } from 'zod';

import { checkInFormSchema, timelogTypeEnum } from '@/validations/check-in/form.validation';

export const createTimeLogInputSchema = z.object({
  clientId: z.string().optional(),
  employeeId: z.string().optional(),
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
  employeeId: z.string().optional(),
});
export type ListTimeLogInputSchema = z.infer<typeof listTimeLogInputSchema>;

export const getTimeLogByClientIdWithDateRangeInputSchema = z.object({
  clientId: z.string().optional(),
  employeeId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
});
export type GetTimeLogByClientIdWithDateRangeInputSchema = z.infer<
  typeof getTimeLogByClientIdWithDateRangeInputSchema
>;

export const checkInInputSchema = checkInFormSchema.extend({
  orgId: z.string().min(1, {
    message: 'Organization ID is required',
  }),
  type: timelogTypeEnum,
});
export type CheckInInputSchema = z.infer<typeof checkInInputSchema>;

export const checkInVerifyInputSchema = checkInInputSchema.extend({
  pin: z.number().min(1, {
    message: 'Pin is required',
  }),
});
export type CheckInVerifyInputSchema = z.infer<typeof checkInVerifyInputSchema>;

export const checkOutInputSchema = checkInInputSchema;
export type CheckOutInputSchema = z.infer<typeof checkOutInputSchema>;

export const checkOutVerifyInputSchema = checkInVerifyInputSchema;
export type CheckOutVerifyInputSchema = z.infer<typeof checkOutVerifyInputSchema>;
