import { z } from 'zod';

import { phoneNumberSchema } from '../common.validation';

export const checkOutFormSchema = z.object({
  phoneNumber: phoneNumberSchema,
});
export type CheckOutFormSchema = z.infer<typeof checkOutFormSchema>;
