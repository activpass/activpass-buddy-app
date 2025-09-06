import { z } from 'zod';

import { contactFormSchema } from '@/validations/contact.validation';

export const createContactInputSchema = contactFormSchema;

export type CreateContactInputSchema = z.infer<typeof createContactInputSchema>;

export const getContactsInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  type: z.enum(['general', 'support', 'billing', 'feature', 'bug', 'partnership']).optional(),
  status: z.enum(['pending', 'in-progress', 'resolved']).optional(),
});

export type GetContactsInputSchema = z.infer<typeof getContactsInputSchema>;

export const updateContactStatusInputSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['pending', 'in-progress', 'resolved']),
  adminNotes: z.string().optional(),
});

export type UpdateContactStatusInputSchema = z.infer<typeof updateContactStatusInputSchema>;
