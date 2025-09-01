import { z } from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/common';

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

// Business type options
export const BUSINESS_TYPE_OPTIONS = {
  GYM: 'Gym',
  YOGA_PILATES: 'Yoga & Pilates',
  FITNESS_CENTER: 'Fitness Center',
  MARTIAL_ARTS: 'Martial Arts',
  DANCE_STUDIO: 'Dance Studio',
  PERSONAL_TRAINING: 'Personal Training',
  CROSSFIT: 'CrossFit',
  SPORTS_CLUB: 'Sports Club',
} as const;

export const getBusinessTypeOptions = () => {
  return Object.entries(BUSINESS_TYPE_OPTIONS).map(([value, label]) => ({
    value,
    label,
  }));
};

export const onboardingFacilitySetupSchema = z.object({
  facilityName: z.string().min(1, {
    message: 'Facility name is required',
  }),
  businessType: z
    .string()
    .min(1, {
      message: 'Business type is required',
    })
    .refine(value => Object.keys(BUSINESS_TYPE_OPTIONS).includes(value), {
      message: 'Please select a valid business type',
    }),
  logo: z
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
