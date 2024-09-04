import { z } from 'zod';

import { phoneNumberSchema } from '../common.validation';

export const checkInFormSchema = z.object({
  phoneNumber: phoneNumberSchema,
});
export type CheckInFormSchema = z.infer<typeof checkInFormSchema>;
