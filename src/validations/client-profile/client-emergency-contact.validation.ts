import type { z } from 'zod';

import { clientEmergencyContactSChema } from '@/validations/client/add-form.validation';

export const clientEmergencyContactFormSchema = clientEmergencyContactSChema.pick({
  name: true,
  relationship: true,
  phoneNumber: true,
  email: true,
  address: true,
});

export type ClientEmergencyContactFormSchema = z.infer<typeof clientEmergencyContactFormSchema>;
