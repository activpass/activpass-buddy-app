import { z } from 'zod';

import { baseSignUpValidationSchema } from '@/validations/auth.validation';
import { imageKitFileResponseSchema } from '@/validations/common.validation';
import { userFormSchema } from '@/validations/user/add-form.validation';

export const createUserInputSchema = baseSignUpValidationSchema.omit({ confirmPassword: true });
export type CreateUserInputSchema = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.string(),
  data: userFormSchema
    .omit({
      organization: true,
    })
    .extend({
      organization: userFormSchema.shape.organization
        .omit({
          logo: true,
        })
        .extend({
          logo: imageKitFileResponseSchema.nullable(),
        }),
    }),
});
export type UpdateUserInputSchema = z.infer<typeof updateUserInputSchema>;

export const getUserByIdInputSchema = z.object({
  id: z.string().min(1, {
    message: 'User ID is required',
  }),
});
export type GetUserByIdInputSchema = z.infer<typeof getUserByIdInputSchema>;

export const getOnboardingUserInputSchema = z.object({
  userId: z.string(),
});
export type GetOnboardingUserInputSchema = z.infer<typeof getOnboardingUserInputSchema>;

export const updateAvatarInputSchema = getUserByIdInputSchema.extend({
  avatar: imageKitFileResponseSchema.nullable(),
});
export type UpdateAvatarInputSchema = z.infer<typeof updateAvatarInputSchema>;

export const deleteAvatarInputSchema = getUserByIdInputSchema;
export type DeleteAvatarInputSchema = z.infer<typeof deleteAvatarInputSchema>;
