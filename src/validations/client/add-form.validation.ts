import { convertObjectKeysIntoZodEnum } from '@paalan/react-shared/lib';
import { startOfDay } from 'date-fns';
import { z } from 'zod';

import {
  CLIENT_ADDITIONAL_SERVICE,
  CLIENT_CLASS_PREFERENCE,
  CLIENT_FITNESS_GOAL,
  CLIENT_FITNESS_LEVEL,
  CLIENT_GENDER,
  CLIENT_PAYMENT_FREQUENCY,
  CLIENT_PAYMENT_METHOD,
  CLIENT_PAYMENT_STATUS,
  CLIENT_RELATIONSHIP,
} from '@/constants/client/add-form.constant';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/common';

import { phoneNumberSchema } from '../common.validation';
import { createMembershipPlanSchema } from './membership.validation';

export const clientPersonalInformationSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, { message: 'File size should be less than 2MB.' })
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    )
    .nullable(),
  firstName: z.string().min(1, {
    message: 'First name is required',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required',
  }),
  gender: convertObjectKeysIntoZodEnum(CLIENT_GENDER),
  dob: z
    .date({
      message: 'Date of birth is required',
    })
    .or(
      z.string({
        message: 'Date of birth is required',
      })
    )
    .refine(value => new Date(value) < startOfDay(new Date()), {
      message: 'Date of birth must be before today',
    }),
  phoneNumber: phoneNumberSchema,
  email: z.string().email({
    message: 'Invalid email',
  }),
  address: z.string().min(10, {
    message: 'Address must be at least 10 characters',
  }),
});
export type ClientPersonalInformationSchema = z.infer<typeof clientPersonalInformationSchema>;

export const clientEmergencyContactSChema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  relationship: convertObjectKeysIntoZodEnum(CLIENT_RELATIONSHIP),
  phoneNumber: phoneNumberSchema,
  email: z.union([
    z.literal(''),
    z.string().email({
      message: 'Invalid email address',
    }),
  ]),
  address: z.string().nullish(),
});
export type ClientEmergencyContactSchema = z.infer<typeof clientEmergencyContactSChema>;

export const clientInformationSchema = clientPersonalInformationSchema.extend({
  emergencyContact: clientEmergencyContactSChema,
});
export type ClientInformationSchema = z.infer<typeof clientInformationSchema>;

export const healthAndFitnessSchema = z.object({
  height: z.number().min(1, {
    message: 'Height is required',
  }),
  weight: z.number().min(1, {
    message: 'Weight is required',
  }),
  fitnessLevel: convertObjectKeysIntoZodEnum(CLIENT_FITNESS_LEVEL),
  medicalCondition: z.string(),
  allergy: z.string(),
  injury: z.string(),
});
export type HealthAndFitnessSchema = z.infer<typeof healthAndFitnessSchema>;

export const goalsAndPreferenceSchema = z.object({
  fitnessGoals: z.array(convertObjectKeysIntoZodEnum(CLIENT_FITNESS_GOAL), {
    message: 'Fitness goals is required',
  }),
  classPreference: convertObjectKeysIntoZodEnum(CLIENT_CLASS_PREFERENCE),
  classTimePreference: z.string().min(1, {
    message: 'Time preference is required',
  }),
  additionalServices: convertObjectKeysIntoZodEnum(CLIENT_ADDITIONAL_SERVICE).array().optional(),
  instructorSupport: z.boolean(),
  fitnessAssessment: z.boolean(),
});
export type GoalsAndPreferencesSchema = z.infer<typeof goalsAndPreferenceSchema>;

export const membershipDetailSchema = createMembershipPlanSchema.pick({ tenure: true }).extend({
  planId: z.string().min(1, {
    message: 'Membership Plan ID is required',
  }),
});
export type MembershipDetailSchema = z.infer<typeof membershipDetailSchema>;

export const paymentDetailSchema = z.object({
  paymentMethod: convertObjectKeysIntoZodEnum(CLIENT_PAYMENT_METHOD),
  paymentFrequency: convertObjectKeysIntoZodEnum(CLIENT_PAYMENT_FREQUENCY),
  paymentStatus: convertObjectKeysIntoZodEnum(CLIENT_PAYMENT_STATUS),
});
export type PaymentDetailSchema = z.infer<typeof paymentDetailSchema>;

export const consentAndAgreementSchema = z.object({
  termsAndConditions: z.boolean().refine(value => value, {
    message: 'You must agree to the terms and conditions',
  }),
  privacyPolicy: z.boolean().refine(value => value, {
    message: 'You must agree to the privacy policy',
  }),
  websAppCommunication: z.boolean().refine(value => value, {
    message: 'You must agree to the WhatsApp communication',
  }),
  promotionalCommunication: z.boolean(),
  signature: z.object({
    name: z.string().min(1, {
      message: 'Signature Name is required',
    }),
    provider: z.string().optional(),
  }),
});
export type ConsentAndAgreementSchema = z.infer<typeof consentAndAgreementSchema>;

export const clientFormSchema = z.object({
  personalInformation: clientPersonalInformationSchema,
  emergencyContact: clientEmergencyContactSChema,
  healthAndFitness: healthAndFitnessSchema,
  goalsAndPreference: goalsAndPreferenceSchema,
  membershipDetail: membershipDetailSchema,
  paymentDetail: paymentDetailSchema,
  consentAndAgreement: consentAndAgreementSchema,
});
export type ClientFormSchema = z.infer<typeof clientFormSchema>;
