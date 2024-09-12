import { z } from 'zod';

import { clientFormSchema } from '@/validations/client/add-form.validation';

export const createClientInputSchema = clientFormSchema.omit({ personalInformation: true }).extend({
  personalInformation: clientFormSchema.shape.personalInformation.extend({
    avatar: z.string().optional(),
    dob: z.date(),
  }),
});
export type CreateClientInputSchema = z.infer<typeof createClientInputSchema>;

export const updateClientInputSchema = z.object({
  id: z.string().min(1, {
    message: 'Client ID is required',
  }),
  data: z
    .object({
      personalInformation: createClientInputSchema.shape.personalInformation.partial(),
      emergencyContact: createClientInputSchema.shape.emergencyContact.partial(),
      goalsAndPreference: createClientInputSchema.shape.goalsAndPreference.partial(),
      healthAndFitness: createClientInputSchema.shape.healthAndFitness.partial(),
      avatar: z.string().optional(),
    })
    .partial(),
});
export type UpdateClientInputSchema = z.infer<typeof updateClientInputSchema>;
