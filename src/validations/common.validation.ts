import { z } from 'zod';

export const phoneNumberSchema = z
  .number({
    message: 'Phone number is required',
  })
  .int({
    message: 'Phone number must be a number without decimal',
  })
  .refine(value => value.toString().length === 10, {
    message: 'Phone number must be a 10 digit number',
  });
