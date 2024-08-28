import { z } from 'zod';

export const clientInfoFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Name must not be longer than 50 characters.',
    }),
  phoneNumber: z
    .string()
    .min(10, {
      message: 'Phone Number must be at least 10 digits.',
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
  gender: z.string(),
  dob: z
    .string({
      required_error: 'Please enter your date of birth.',
    })
    .refine(val => !Number.isNaN(Date.parse(val)), {
      message: 'Please enter a valid date.',
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

export type ClientInfoFormSchemaType = z.infer<typeof clientInfoFormSchema>;
