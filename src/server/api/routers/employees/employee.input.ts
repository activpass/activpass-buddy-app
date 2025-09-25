import { z } from 'zod';

import { imageKitFileResponseSchema } from '@/validations/common.validation';
import { employeeFormSchema } from '@/validations/employee/add-form.validation';

export const createEmployeeInputSchema = employeeFormSchema;
export type CreateEmployeeInputSchema = z.infer<typeof createEmployeeInputSchema>;

export const updateEmployeeInputSchema = z.object({
  id: z.string().min(1, 'Employee ID is required'),
  data: employeeFormSchema.partial(),
});
export type UpdateEmployeeInputSchema = z.infer<typeof updateEmployeeInputSchema>;

export const getEmployeeInputSchema = z.object({
  id: z.string().min(1, 'Employee ID is required'),
});
export type GetEmployeeInputSchema = z.infer<typeof getEmployeeInputSchema>;

export const listEmployeesInputSchema = z.object({
  role: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type ListEmployeesInputSchema = z.infer<typeof listEmployeesInputSchema>;

export const deleteEmployeeInputSchema = z.object({
  id: z.string().min(1, 'Employee ID is required'),
});
export type DeleteEmployeeInputSchema = z.infer<typeof deleteEmployeeInputSchema>;

export const employeeAnalyticsInputSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
export type EmployeeAnalyticsInputSchema = z.infer<typeof employeeAnalyticsInputSchema>;

export const getPaySlipsInputSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type GetPaySlipsInputSchema = z.infer<typeof getPaySlipsInputSchema>;

export const getPaySlipByIdInputSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  paySlipId: z.string().min(1, 'PaySlip ID is required'),
});
export type GetPaySlipByIdInputSchema = z.infer<typeof getPaySlipByIdInputSchema>;

export const updatePayrollInputSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  payrollData: z.object({
    grossSalary: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    compensation: z.array(z.string()).optional(),
  }),
});
export type UpdatePayrollInputSchema = z.infer<typeof updatePayrollInputSchema>;

export const updateLeavesInputSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  leaveType: z.enum(['casual', 'medical', 'earned']),
  operation: z.enum(['add', 'use']),
  amount: z.number().min(0),
});
export type UpdateLeavesInputSchema = z.infer<typeof updateLeavesInputSchema>;

export const getAttendanceInputSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type GetAttendanceInputSchema = z.infer<typeof getAttendanceInputSchema>;

export const changePasswordInputSchema = z
  .object({
    employeeCode: z.string().min(1, 'Employee code is required'),
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type ChangePasswordInputSchema = z.infer<typeof changePasswordInputSchema>;

export const bulkUpdateEmployeesInputSchema = z.object({
  employeeCodes: z.array(z.string()).min(1, 'At least one employee code is required'),
  data: employeeFormSchema.partial(),
});
export type BulkUpdateEmployeesInputSchema = z.infer<typeof bulkUpdateEmployeesInputSchema>;

export const getReportingManagersInputSchema = z.object({
  includeEmployees: z.boolean().optional(),
});
export type GetReportingManagersInputSchema = z.infer<typeof getReportingManagersInputSchema>;

export const updateAvatarInputSchema = z.object({
  avatar: imageKitFileResponseSchema.nullable(),
  employeeId: z.string().min(1, {
    message: 'Employee ID is required',
  }),
});
export type UpdateAvatarInputSchema = z.infer<typeof updateAvatarInputSchema>;

export const deleteAvatarInputSchema = z.object({
  employeeId: z.string().min(1, {
    message: 'Employee ID is required',
  }),
});
export type DeleteAvatarInputSchema = z.infer<typeof deleteAvatarInputSchema>;
