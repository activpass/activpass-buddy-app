import z from 'zod';

import { personalInformationFormSchema } from '../employee/add-form.validation';
import { onboardingFacilitySetupSchema } from '../onboarding.validation';

export enum UserTypeEnum {
  EMPLOYEE = 'employee',
  OWNER = 'owner',
}

// Main user form schema
export const userFormSchema = personalInformationFormSchema
  .omit({
    emergencyContact: true,
  })
  .extend({
    // Related schemas
    organization: onboardingFacilitySetupSchema.extend({
      id: z.string().min(1, { message: 'Organization ID is required' }).optional(),
    }),
  });
export type UserFormSchema = z.infer<typeof userFormSchema>;
