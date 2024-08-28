import { z } from 'zod';

export const clientEmergencyContactFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Name must not be longer than 50 characters.',
    }),
  relationship: z
    .string()
    .min(2, {
      message: 'Relationship must be at least 2 characters.',
    })
    .max(50, {
      message: 'Relationship must not be longer than 50 characters.',
    }),
  phoneNumber: z
    .string()
    .min(10, {
      message: 'Phone Number must be at least 10 digits.',
    })
    .max(15, {
      message: 'Phone Number must not be longer than 15 digits.',
    })
    .regex(/^\d+$/, {
      message: 'Phone Number must contain only digits.',
    }),
  email: z
    .string({
      required_error: 'Please enter your email.',
    })
    .email({ message: 'Please enter a valid email address.' })
    .refine(val => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(val), {
      message: 'Please enter a properly formatted email address.',
    }),
  address: z
    .string()
    .min(5, {
      message: 'Address must be at least 5 characters.',
    })
    .max(100, {
      message: 'Address must not be longer than 100 characters.',
    }),
});

export type ClientEmergencyContactFormSchemaType = z.infer<typeof clientEmergencyContactFormSchema>;
