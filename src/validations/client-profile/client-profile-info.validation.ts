import type { z } from 'zod';

import { clientPersonalInformationSchema } from '@/validations/client/add-form.validation';

export const clientInfoFormSchema = clientPersonalInformationSchema.pick({
  firstName: true,
  lastName: true,
  phoneNumber: true,
  email: true,
  gender: true,
  dob: true,
  address: true,
});

export type ClientInfoFormSchema = z.infer<typeof clientInfoFormSchema>;
