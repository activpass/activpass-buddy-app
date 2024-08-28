import { z } from 'zod';

export const clientGoalsPreferencesFormSchema = z.object({
  fitnessGoals: z
    .string()
    .min(3, {
      message: 'Fitness goals must be at least 3 characters.',
    })
    .max(100, {
      message: 'Fitness goals must not be longer than 100 characters.',
    }),
  dayPreference: z.enum(['Morning', 'Afternoon', 'Evening'], {
    required_error: 'Please select your preferred time of day.',
  }),
  timePreference: z.string().refine(val => /^([01]\d|2[0-3]):([0-5]\d) [APap][Mm]$/.test(val), {
    message: 'Please enter a valid time (e.g., 07:00 AM).',
  }),
  instructorPreference: z.enum(['Yes', 'No'], {
    required_error: 'Please specify if you want an instructor.',
  }),
  additionalService: z
    .string()
    .max(100, {
      message: 'Additional service must not be longer than 100 characters.',
    })
    .optional(),
});

export type ClientGoalsPreferencesFormSchemaType = z.infer<typeof clientGoalsPreferencesFormSchema>;
