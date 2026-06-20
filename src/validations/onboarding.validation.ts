import { convertObjectKeysIntoZodEnum } from '@paalan/react-shared/lib';
import { z } from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/common';
import { BUSINESS_TYPE_OPTIONS } from '@/constants/organization/form.constants';

import { avatarSchema } from './avatar.validation';
import { phoneNumberSchema } from './common.validation';

export const onboardingProfileSetupSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required',
  }),
  email: z.string().email({
    message: 'Invalid email address',
  }),
  phoneNumber: phoneNumberSchema,
  picture: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: 'File size should be less than 2MB.',
    })
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp files are allowed'
    )
    .nullable()
    .optional(),
});

export type OnboardingProfileSetupSchema = z.infer<typeof onboardingProfileSetupSchema>;

export const onboardingFacilitySetupSchema = z.object({
  name: z.string().min(1, {
    message: 'Company name is required',
  }),
  type: convertObjectKeysIntoZodEnum(BUSINESS_TYPE_OPTIONS),
  logo: avatarSchema,
  address: z.string().min(1, {
    message: 'Address is required',
  }),
  city: z.string().min(1, {
    message: 'City is required',
  }),
  pincode: z
    .string()
    .min(1, {
      message: 'Pincode is required',
    })
    .regex(/^\d{6}$/, {
      message: 'Pincode must be 6 digits',
    }),
});

export type OnboardingFacilitySetupSchema = z.infer<typeof onboardingFacilitySetupSchema>;

// Combined onboarding schema
export const onboardingCompleteSchema = z.object({
  profileSetup: onboardingProfileSetupSchema,
  facilitySetup: onboardingFacilitySetupSchema,
});

export type OnboardingCompleteSchema = z.infer<typeof onboardingCompleteSchema>;
