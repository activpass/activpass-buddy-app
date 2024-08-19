import { z } from 'zod';

export const createTimeLogInputSchema = z.object({});
export type CreateTimeLogInputSchema = z.infer<typeof createTimeLogInputSchema>;

export const updateTimeLogInputSchema = z.object({
  id: z.string(),
  data: createTimeLogInputSchema.optional(),
});
export type UpdateTimeLogInputSchema = z.infer<typeof updateTimeLogInputSchema>;

export const listTimeLogInputSchema = z.object({
  clientId: z.string().optional(),
});
