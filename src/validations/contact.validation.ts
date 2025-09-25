import { z } from 'zod';

// Define Zod schemas for validation and type inference
const ContactTypeEnum = z.enum(['general', 'support', 'billing', 'feature', 'bug', 'partnership']);
const ContactStatusEnum = z.enum(['pending', 'in-progress', 'resolved']);

// Base contact schema (for creation) - this will be used to generate the Mongoose schema
export const contactBaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  type: ContactTypeEnum,
  subject: z.string().min(5, 'Subject must be at least 5 characters').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').trim(),
  status: ContactStatusEnum.default('pending'),
  adminNotes: z.string().trim().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// Full contact schema (including timestamps and id)
export const contactSchema = contactBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type inference from Zod schemas
export type IContactBase = z.infer<typeof contactBaseSchema>;
export type IContactSchema = z.infer<typeof contactSchema>;
export type ContactType = z.infer<typeof ContactTypeEnum>;
export type ContactStatus = z.infer<typeof ContactStatusEnum>;

// Contact form validation schema
export const contactFormSchema = contactBaseSchema.pick({
  name: true,
  email: true,
  type: true,
  subject: true,
  message: true,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const getInquiryTypeOptions = () => [
  { label: 'General Inquiry', value: 'general' as const },
  { label: 'Technical Support', value: 'support' as const },
  { label: 'Billing Question', value: 'billing' as const },
  { label: 'Feature Request', value: 'feature' as const },
  { label: 'Bug Report', value: 'bug' as const },
  { label: 'Partnership', value: 'partnership' as const },
];
