import { z } from 'zod';

import { phoneNumberSchema } from '../common.validation';

export const checkInFormSchema = z.object({
  phoneNumber: phoneNumberSchema,
});
export type CheckInFormSchema = z.infer<typeof checkInFormSchema>;

export const checkInVerifyFormSchema = z.object({
  pin: z.string().min(4, {
    message: 'Please enter 4 digit pin',
  }),
});
export type CheckInVerifyFormSchema = z.infer<typeof checkInVerifyFormSchema>;
