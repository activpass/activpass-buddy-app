import { z } from 'zod';

export const clientHealthFitnessFormSchema = z.object({
  height: z.number().min(1, {
    message: 'Height must be at required',
  }),

  weight: z.number().min(1, {
    message: 'Weight must be at required.',
  }),

  medicalConditions: z
    .string()
    .max(100, {
      message: 'Medical conditions must not be longer than 100 characters.',
    })
    .optional(),
  allergies: z.enum(['Yes', 'No'], {
    required_error: 'Please specify if you have allergies.',
  }),
  injuries: z.enum(['Yes', 'No'], {
    required_error: 'Please specify if you have injuries.',
  }),
  currentFitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Please select a fitness level.',
  }),
});

export type ClientHealthFitnessFormSchemaType = z.infer<typeof clientHealthFitnessFormSchema>;
