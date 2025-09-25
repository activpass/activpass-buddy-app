import { convertObjectKeysIntoZodEnum } from '@paalan/react-shared/lib';
import { z } from 'zod';

import { CLIENT_GENDER, CLIENT_RELATIONSHIP } from '@/constants/client/add-form.constant';

import { dateSchema, dobSchema, phoneNumberSchema } from '../common.validation';

// Gender enum
export const GenderEnum = convertObjectKeysIntoZodEnum(CLIENT_GENDER);

// Relationship enum
export const RelationshipEnum = convertObjectKeysIntoZodEnum(CLIENT_RELATIONSHIP);

// Workdays enum
export const WorkdaysEnum = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);
export type WorkdaysEnumType = z.infer<typeof WorkdaysEnum>;

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: RelationshipEnum,
  phoneNumber: phoneNumberSchema,
  gender: GenderEnum,
  // email: z.string().email('Invalid email address').optional(),
  // address: z.string().min(10, 'Address must be at least 10 characters').optional(),
});

// Bank details schema
export const bankDetailsSchema = z.object({
  name: z.string().min(1, 'Bank name is required'),
  accountHolderName: z.string().min(1, 'Account holder name is required'),
  accountNumber: z.number().min(1, 'Account number is required'),
  branchName: z.string().min(1, 'Bank branch name is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
});

// Work schedule schema
export const workScheduleSchema = z.object({
  workDays: z.array(WorkdaysEnum).optional(),
  shiftStartTime: z.string().min(1, 'Shift start time is required'),
  shiftEndTime: z.string().min(1, 'Shift end time is required'),
  breakHours: z
    .number({
      message: 'Break hours must be a number',
    })
    .min(1, 'Minimum break hours is 1')
    .max(5, 'Maximum break hours is 5'),
  entitledHolidays: z
    .number({
      message: 'Entitled holidays must be a number',
    })
    .min(1, 'Minimum entitled holidays is 1')
    .max(30, 'Maximum entitled holidays is 30'),
});

// Roles and responsibilities schema
export const jobDetailsSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  description: z.string().min(1, 'Description is required'),
  // reportTo: z.string().optional(),
});

// Payroll schema
export const payrollSchema = z.object({
  grossSalary: z.string().min(1, 'Gross salary is required'),
  benefits: z.array(z.string()).optional(),
  compensation: z.array(z.string()).optional(),
  dateOfSalary: dateSchema.optional(),
});

// Leaves schema
export const leavesSchema = z.object({
  casual: z.object({
    total: z.number().default(12),
    used: z.number().default(0),
  }),
  medical: z.object({
    total: z.number().default(12),
    used: z.number().default(0),
  }),
  earned: z.object({
    total: z.number().default(0),
    used: z.number().default(0),
  }),
});

// Notification preferences schema
export const notificationPreferencesSchema = z.object({
  email: z.boolean().default(false),
  all: z.boolean().default(false),
  client: z.boolean().default(false),
  employee: z.boolean().default(false),
  finance: z.boolean().default(false),
  membership: z.boolean().default(false),
  isTwoFactorAuthEnabled: z.boolean().default(false),
  isEmailRecoveryEnabled: z.boolean().default(false),
  isMobileNumberRecoveryEnabled: z.boolean().default(false),
});

export const personalInformationFormSchema = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: GenderEnum,
  dob: dobSchema,
  phoneNumber: phoneNumberSchema,
  email: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  emergencyContact: emergencyContactSchema,
});

// Type for personal information form data
export type PersonalInformationFormSchema = z.infer<typeof personalInformationFormSchema>;

// Main employee form schema
export const employeeFormSchema = personalInformationFormSchema.extend({
  // Related schemas
  bank: bankDetailsSchema,
  jobDetails: jobDetailsSchema,
  workSchedule: workScheduleSchema,
  payroll: payrollSchema,
  leaves: leavesSchema.optional(),
  notificationPreferences: notificationPreferencesSchema.optional(),

  // Role information
  role: z.string().optional(),
});

export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;
