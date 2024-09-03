import { z } from 'zod';

export const createCheckinTokenInputSchema = z.object({});
export type CreateCheckinTokenInputSchema = z.infer<typeof createCheckinTokenInputSchema>;

export const updateCheckinTokenInputSchema = z.object({
  id: z.string(),
  data: createCheckinTokenInputSchema.optional(),
});
export type UpdateCheckinTokenInputSchema = z.infer<typeof updateCheckinTokenInputSchema>;

export const listCheckinTokenInputSchema = z.object({
  clientId: z.string().optional(),
});
