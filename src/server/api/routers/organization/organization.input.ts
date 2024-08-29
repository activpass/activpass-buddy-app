import { z } from 'zod';

export const createOrganizationInputSchema = z.object({
  name: z.string({ required_error: 'Organization name is required' }).min(1, {
    message: 'Organization name is required',
  }),
  type: z.string({ required_error: 'Organization type is required' }).min(1, {
    message: 'Organization type is required',
  }),
  subscription: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  coordinates: z.object({
    lat: z.string().optional(),
    lng: z.string().optional(),
  }),
  address: z.string().optional(),
  billingInfo: z
    .object({
      paymentMethod: z.enum(['creditCard', 'debitCard', 'cash', 'upi', 'bankTransfer']),
    })
    .optional(),
  softwareIntegration: z
    .object({
      existingSoftware: z.enum([
        'gymMgmtSoftware',
        'accountingSoftware',
        'crmSoftware',
        'noSoftware',
        'other',
      ]),
      challenges: z.string().optional(),
      preferences: z.string().optional(),
    })
    .optional(),
  employeePayrollOptions: z
    .object({
      earnings: z.array(z.object({})).optional(),
      deductions: z.array(z.object({})).optional(),
    })
    .optional(),
  declaredHolidays: z.array(z.object({})).optional(),
});
export type CreateOrganizationInputSchema = z.infer<typeof createOrganizationInputSchema>;

export const updateOrganizationInputSchema = z.object({
  id: z.string(),
  data: createOrganizationInputSchema.optional(),
});
export type UpdateOrganizationInputSchema = z.infer<typeof updateOrganizationInputSchema>;
