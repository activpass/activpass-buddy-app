import { z } from 'zod';

import { clientFormSchema } from '@/validations/client/add-form.validation';

export const createClientInputSchema = clientFormSchema.omit({ clientInformation: true }).extend({
  clientInformation: clientFormSchema.shape.clientInformation.extend({
    avatar: z.string().optional(),
    dob: z.date(),
  }),
});
export type CreateClientInputSchema = z.infer<typeof createClientInputSchema>;

export const updateClientInputSchema = z.object({
  id: z.string().min(1, {
    message: 'Client ID is required',
  }),
  data: createClientInputSchema.optional(),
});
export type UpdateClientInputSchema = z.infer<typeof updateClientInputSchema>;
