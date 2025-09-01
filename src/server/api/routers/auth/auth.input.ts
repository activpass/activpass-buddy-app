import { z } from 'zod';

import {
  baseSignUpValidationSchema,
  signInValidationSchema,
  signUpValidationSchema,
} from '@/validations/auth.validation';
import { imageKitFileResponseMongoSchema } from '@/validations/mongo.validation';
import {
  onboardingFacilitySetupSchema,
  onboardingProfileSetupSchema,
} from '@/validations/onboarding.validation';

export const signInInputSchema = signInValidationSchema;
export type SignInInputSchemaType = z.infer<typeof signInInputSchema>;

export const signUpInputSchema = signUpValidationSchema;
export type SignUpInputSchema = z.infer<typeof signUpInputSchema>;

export const accountVerifyInputSchema = z.object({
  token: z.string(),
});
export type AccountVerifyInputSchema = z.infer<typeof accountVerifyInputSchema>;

export const resetPasswordInputSchema = baseSignUpValidationSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    passwordToken: z.string(),
  });
export type ResetPasswordInputSchema = z.infer<typeof resetPasswordInputSchema>;

export const forgotPasswordInputSchema = baseSignUpValidationSchema.pick({ email: true });
export type ForgotPasswordInputSchema = z.infer<typeof forgotPasswordInputSchema>;

export const createOnboardingStepInputSchema = z.object({
  userId: z.string(),
  data: z.object({
    profileSetup: onboardingProfileSetupSchema.omit({ picture: true }).extend({
      avatar: imageKitFileResponseMongoSchema.optional(),
    }),
    facilitySetup: onboardingFacilitySetupSchema.omit({ logo: true }).extend({
      logo: imageKitFileResponseMongoSchema.optional(),
    }),
  }),
});
export type CreateOnboardingStepInputSchema = z.infer<typeof createOnboardingStepInputSchema>;
