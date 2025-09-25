import { type z } from 'zod';

import type { employeeFormSchema } from '@/validations/employee/add-form.validation';

import { type IUserSchema } from '../user/model/user.model';
import type { DeleteAvatarInputSchema, UpdateAvatarInputSchema } from './employee.input';

// Use the User schema as the base for employee operations
export type IEmployeeSchema = IUserSchema;

// Input types from validation schemas
export type IEmployeeCreateInput = z.infer<typeof employeeFormSchema>;
export type IEmployeeUpdateInput = Partial<IEmployeeCreateInput>;

// Simple input types for operations
export interface IEmployeeListInput {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface EmployeeAnalyticsArgs {
  orgId: string;
  department?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Repository response types
export interface IEmployeeListResponse {
  employees: Array<IEmployeeSchema>;
  genderDistribution: Array<{
    gender: string;
    count: number;
  }>;
  employeesWithSalaryData: number;
}

export interface IReportingManager {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  designation?: string;
  department?: string;
  role: {
    name: string;
    value: string;
  };
}

export interface IEmployeeAnalyticsResponse {
  totalEmployees: number;
  present: number;
  absent: number;
  estimatedSalary: number;
  departmentWise: {
    [department: string]: {
      total: number;
      present: number;
      absent: number;
    };
  };
}

// Service method return types
export type GetEmployeeResult = IEmployeeSchema | null;
export type CreateEmployeeResult = IEmployeeSchema;
export type UpdateEmployeeResult = IEmployeeSchema;
export type ListEmployeesResult = IEmployeeListResponse;
export type AnalyticsResult = IEmployeeAnalyticsResponse;
export type ReportingManagersResult = IReportingManager[];

// Legacy compatibility - keeping existing interfaces for backward compatibility
export interface EmployeeListItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  designation?: string;
  department: string;
  role: {
    name: string;
    value: string;
  };
  joiningDate: Date;
  status: 'active' | 'inactive';
}

export interface EmployeeAnalytics {
  totalEmployees: number;
  present: number;
  absent: number;
  estimatedSalary: number;
  departmentWise: {
    [department: string]: {
      total: number;
      present: number;
      absent: number;
    };
  };
}

export interface ReportingManager {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: {
    name: string;
    value: string;
  };
}

export type UpdateAvatarArgs = {
  input: UpdateAvatarInputSchema;
};

export type DeleteAvatarArgs = {
  input: DeleteAvatarInputSchema;
};
