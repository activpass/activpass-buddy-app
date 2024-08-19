import { z } from 'zod';

import {
  AdditionalService,
  BillingCycle,
  DayPreference,
  FitnessLevel,
  Gender,
  RelationShip,
} from '../../constants/common.constant';
import { getObjectValuesForZodEnum } from '../../utils/common';

export const createClientInputSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  designation: z.string().min(2).max(50),
  avatar: z.string().optional(),
  membership: z.string().optional(),
  gender: z.enum(getObjectValuesForZodEnum(Gender)),
  dob: z.date().optional(),

  validity: z.date().optional(),
  cycle: z.enum(getObjectValuesForZodEnum(BillingCycle)).optional(),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(15),
  address: z.string(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.enum(getObjectValuesForZodEnum(RelationShip)).optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
  }),
  role: z.string().optional(),
  tokens: z.array(z.string()).optional(),
  healthFitness: z.object({
    height: z.number().optional(),
    weight: z.number().optional(),
    medicalConditions: z.string().optional(),
    allergies: z.string().optional(),
    injuries: z.string().optional(),
    currentFitnessLevel: z.enum(getObjectValuesForZodEnum(FitnessLevel)).optional(),
  }),
  goalsPreferences: z.object({
    fitnessGoals: z.string().optional(),
    dayPreference: z.enum(getObjectValuesForZodEnum(DayPreference)).optional(),
    timePreference: z.date().optional(),
    instructorPreference: z.boolean().optional(),
    personalAssistance: z.boolean().optional(),
    additionalService: z.enum(getObjectValuesForZodEnum(AdditionalService)).optional(),
    otherService: z.string().optional(),
    fitnessAssessment: z.boolean().optional(),
  }),
});
export type CreateClientInputSchema = z.infer<typeof createClientInputSchema>;

export const updateClientInputSchema = z.object({
  id: z.string(),
  data: createClientInputSchema.optional(),
});
export type UpdateClientInputSchema = z.infer<typeof updateClientInputSchema>;
