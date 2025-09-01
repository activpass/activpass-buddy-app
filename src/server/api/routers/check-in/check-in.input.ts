import { z } from 'zod';

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
export type ListCheckInInputSchema = z.infer<typeof listCheckInInputSchema>;
