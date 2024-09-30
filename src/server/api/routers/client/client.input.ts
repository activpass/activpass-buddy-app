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

export const verifyOnboardingTokenInputSchema = z.object({
  token: z.string().min(1, {
    message: 'Token is required',
  }),
});
export type VerifyOnboardingTokenInputSchema = z.infer<typeof verifyOnboardingTokenInputSchema>;

export const submitOnboardingClientInputSchema = createClientInputSchema.extend({
  orgId: z.string().min(1, {
    message: 'Organization ID is required',
  }),
  onboardClientId: z.string().min(1, {
    message: 'Onboard client ID is required',
  }),
});
export type SubmitOnboardingClientInputSchema = z.infer<typeof submitOnboardingClientInputSchema>;

export const updateOnboardClientInputSchema = z.object({
  onboardClientId: z.string().min(1, {
    message: 'Onboard client ID is required',
  }),
  data: z.object({
    onBoarded: z.boolean().optional(),
  }),
});
export type UpdateOnboardClientInputSchema = z.infer<typeof updateOnboardClientInputSchema>;
