import { z } from 'zod';

import { employeeFormSchema } from '@/validations/employee/add-form.validation';

// Define enums for employee onboarding status
export const OnboardEmployeeStatusEnum = z.enum([
  'PENDING', // Invitation sent, waiting for employee to start
  'IN_PROGRESS', // Employee has started the onboarding process
  'COMPLETED', // Employee has completed onboarding
  'EXPIRED', // Onboarding token has expired
  'CANCELLED', // Onboarding was cancelled
]);
export type OnboardEmployeeStatus = z.infer<typeof OnboardEmployeeStatusEnum>;

export const onboardEmployeeBaseSchema = z.object({
  metadata: z.record(z.string(), z.any()),
});

// Schema for onboard employee updates (all fields optional except id)
export const onboardEmployeeUpdateSchema = onboardEmployeeBaseSchema.partial().extend({
  id: z.string(),
});

// Schema for onboard employee filtering/querying
export const onboardEmployeeFilterSchema = z.object({
  search: z.string().optional().describe('Search in employee name, email, or employee ID'),
  organizationId: z.string().optional(),
  status: OnboardEmployeeStatusEnum.optional(),
  verified: z.boolean().optional(),
  onBoarded: z.boolean().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  managerId: z.string().optional(),
  assignedRoleId: z.string().optional(),
  createdById: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  startDateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  expirationStatus: z.enum(['ACTIVE', 'EXPIRED', 'EXPIRING_SOON']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum([
      'createdAt',
      'updatedAt',
      'expiresAt',
      'startDate',
      'onBoardedAt',
      'verifiedAt',
      'status',
      'employeeId',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Schema for token verification
export const onboardEmployeeTokenVerificationSchema = z.object({
  token: z.string().min(32, 'Invalid token'),
  organizationId: z.string().optional(),
});

// Schema for completing onboarding
export const onboardEmployeeCompletionSchema = z.object({
  token: z.string().min(32, 'Invalid token'),
  employeeData: employeeFormSchema,
});

// Schema for sending reminders
export const onboardEmployeeReminderSchema = z.object({
  onboardingIds: z.array(z.string()).min(1, 'At least one onboarding ID is required'),
  customMessage: z.string().max(500, 'Custom message must not exceed 500 characters').optional(),
});

// Schema for bulk operations
export const onboardEmployeeBulkOperationSchema = z.object({
  onboardingIds: z.array(z.string()).min(1, 'At least one onboarding ID is required'),
  operation: z.enum(['CANCEL', 'EXTEND_EXPIRY', 'RESEND_INVITATION', 'DELETE']),
  parameters: z.record(z.string(), z.any()).optional(),
});

// Custom validation for date constraints
export const validateOnboardEmployeeDates = z
  .object({
    expiresAt: z.date(),
    startDate: z.date().optional(),
    onBoardedAt: z.date().optional(),
    verifiedAt: z.date().optional(),
  })
  .refine(data => data.expiresAt > new Date(), {
    message: 'Expiration date must be in the future',
    path: ['expiresAt'],
  })
  .refine(data => !data.startDate || data.startDate >= new Date(), {
    message: 'Start date cannot be in the past',
    path: ['startDate'],
  })
  .refine(data => !data.onBoardedAt || data.onBoardedAt <= new Date(), {
    message: 'Onboarded date cannot be in the future',
    path: ['onBoardedAt'],
  })
  .refine(data => !data.verifiedAt || data.verifiedAt <= new Date(), {
    message: 'Verified date cannot be in the future',
    path: ['verifiedAt'],
  });

export type IOnboardEmployeeUpdate = z.infer<typeof onboardEmployeeUpdateSchema>;
export type IOnboardEmployeeFilter = z.infer<typeof onboardEmployeeFilterSchema>;
export type IOnboardEmployeeTokenVerification = z.infer<
  typeof onboardEmployeeTokenVerificationSchema
>;
export type IOnboardEmployeeCompletion = z.infer<typeof onboardEmployeeCompletionSchema>;
export type IOnboardEmployeeReminder = z.infer<typeof onboardEmployeeReminderSchema>;
export type IOnboardEmployeeBulkOperation = z.infer<typeof onboardEmployeeBulkOperationSchema>;

// Simplified Onboard Employee Input Schemas - Token verification and completion

export const verifyOnboardEmployeeTokenInputSchema = onboardEmployeeTokenVerificationSchema;
export type VerifyOnboardEmployeeTokenInputSchema = z.infer<
  typeof verifyOnboardEmployeeTokenInputSchema
>;

export const completeOnboardEmployeeInputSchema = onboardEmployeeCompletionSchema;
export type CompleteOnboardEmployeeInputSchema = z.infer<typeof completeOnboardEmployeeInputSchema>;

export const getOnboardEmployeeByTokenInputSchema = z.object({
  token: z.string().min(32, 'Invalid token'),
});
export type GetOnboardEmployeeByTokenInputSchema = z.infer<
  typeof getOnboardEmployeeByTokenInputSchema
>;

export const sendOnboardingEmailWithOrgDetailsInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  customMessage: z.string().max(500, 'Custom message must not exceed 500 characters').optional(),
  expirationDays: z.number().min(1).max(30).optional(),
});
export type SendOnboardingEmailWithOrgDetailsInputSchema = z.infer<
  typeof sendOnboardingEmailWithOrgDetailsInputSchema
>;
