import { z } from 'zod';

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
