import type { z } from 'zod';

import { goalsAndPreferenceSchema } from '@/validations/client/add-form.validation';

export const clientGoalsPreferencesFormSchema = goalsAndPreferenceSchema.pick({
  fitnessGoals: true,
  classPreference: true,
  classTimePreference: true,
  instructorSupport: true,
});

export type ClientGoalsPreferencesFormSchema = z.infer<typeof clientGoalsPreferencesFormSchema>;
