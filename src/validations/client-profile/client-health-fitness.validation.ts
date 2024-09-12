import type { z } from 'zod';

import { healthAndFitnessSchema } from '@/validations/client/add-form.validation';

export const clientHealthFitnessFormSchema = healthAndFitnessSchema.pick({
  height: true,
  weight: true,
  medicalCondition: true,
  allergy: true,
  injury: true,
  fitnessLevel: true,
});

export type ClientHealthFitnessFormSchema = z.infer<typeof clientHealthFitnessFormSchema>;
