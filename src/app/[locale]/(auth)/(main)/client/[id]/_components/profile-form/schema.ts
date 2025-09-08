import type { z } from 'zod';

import {
  clientFormSchema,
  clientPersonalInformationSchema,
} from '@/validations/client/add-form.validation';

const clientPersonalInformationWithoutAvatarSchema = clientPersonalInformationSchema.omit({
  avatar: true,
});

export const clientProfileFormSchema = clientFormSchema
  .pick({
    emergencyContact: true,
    healthAndFitness: true,
  })
  .extend({
    personalInformation: clientPersonalInformationWithoutAvatarSchema,
  });
export type ClientProfileFormSchema = z.infer<typeof clientProfileFormSchema>;
