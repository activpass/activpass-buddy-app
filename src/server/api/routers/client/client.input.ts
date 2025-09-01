import { z } from 'zod';

import { clientFormSchema } from '@/validations/client/add-form.validation';
import { imageKitFileResponseSchema } from '@/validations/common.validation';

export const createClientInputSchema = clientFormSchema.omit({ personalInformation: true }).extend({
  personalInformation: clientFormSchema.shape.personalInformation.extend({
    avatar: imageKitFileResponseSchema.nullable(),
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
      emergencyContact: createClientInputSchema.shape.emergencyContact,
      goalsAndPreference: createClientInputSchema.shape.goalsAndPreference,
      healthAndFitness: createClientInputSchema.shape.healthAndFitness,
      avatar: imageKitFileResponseSchema.nullable(),
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

export const updateAvatarInputSchema = z.object({
  avatar: imageKitFileResponseSchema.nullable(),
  clientId: z.string().min(1, {
    message: 'Client ID is required',
  }),
});
export type UpdateAvatarInputSchema = z.infer<typeof updateAvatarInputSchema>;

export const deleteAvatarInputSchema = z.object({
  clientId: z.string().min(1, {
    message: 'Client ID is required',
  }),
});
export type DeleteAvatarInputSchema = z.infer<typeof deleteAvatarInputSchema>;

export const upgradeMembershipPlanInputSchema = z.object({
  clientId: z.string().min(1, {
    message: 'Client ID is required',
  }),
  membershipPlanId: z.string().min(1, {
    message: 'Membership plan ID is required',
  }),
});
export type UpgradeMembershipPlanInputSchema = z.infer<typeof upgradeMembershipPlanInputSchema>;
export const renewMembershipPlanInputSchema = upgradeMembershipPlanInputSchema;
export type RenewMembershipPlanInputSchema = z.infer<typeof renewMembershipPlanInputSchema>;

export const getCurrentMembershipPlanInputSchema = z.object({
  clientId: z.string().min(1, {
    message: 'Client ID is required',
  }),
});
export type GetCurrentMembershipPlanInputSchema = z.infer<
  typeof getCurrentMembershipPlanInputSchema
>;
