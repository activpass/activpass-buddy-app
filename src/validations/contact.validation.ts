import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  type: z.enum(['general', 'support', 'billing', 'feature', 'bug', 'partnership']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactType = z.infer<typeof contactFormSchema>['type'];
export type ContactStatus = 'pending' | 'in-progress' | 'resolved';

export const getInquiryTypeOptions = () => [
  { label: 'General Inquiry', value: 'general' as const },
  { label: 'Technical Support', value: 'support' as const },
  { label: 'Billing Question', value: 'billing' as const },
  { label: 'Feature Request', value: 'feature' as const },
  { label: 'Bug Report', value: 'bug' as const },
  { label: 'Partnership', value: 'partnership' as const },
];
