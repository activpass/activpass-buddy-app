import { TRPCError } from '@trpc/server';

import { deleteFileFromImageKit } from '@/server/api/utils/imagekit';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger';

import { UserModel } from '../../user/model/user.model';
import type { CreateEmployeeInputSchema, UpdateEmployeeInputSchema } from '../employee.input';
import type { DeleteAvatarArgs, UpdateAvatarArgs } from '../employee.types';
import { employeeRepository } from '../repository/employee.repository';

class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  // Helper method to check permissions
  private async checkPermission(userId: string, permission: string): Promise<void> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const hasPermission = await user.hasPermission(permission);
    if (!hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Insufficient permissions: ${permission} required`,
      });
    }
  }

  getById = async (id: string, userId?: string) => {
    try {
      if (userId) {
        await this.checkPermission(userId, 'employee:read');
      }
      const doc = await employeeRepository.getById(id);
      return doc.toObject({
        flattenObjectIds: true,
      });
    } catch (error) {
      this.logger.error('Failed to get employee by id', error);
      throw getTRPCError(error);
    }
  };

  create = async (input: CreateEmployeeInputSchema, orgId: string, userId?: string) => {
    try {
      if (userId) {
        await this.checkPermission(userId, 'employee:write');
      }
      return (await employeeRepository.create(input, orgId)).toObject();
    } catch (error) {
      this.logger.error('Failed to create employee', error);
      throw getTRPCError(error);
    }
  };

  update = async (
    id: string,
    data: UpdateEmployeeInputSchema['data'],
    orgId: string,
    userId?: string
  ) => {
    try {
      if (userId) {
        await this.checkPermission(userId, 'employee:write');
      }
      return (await employeeRepository.update(id, data, orgId)).toObject();
    } catch (error) {
      this.logger.error('Failed to update employee', error);
      throw getTRPCError(error);
    }
  };

  list = async (
    orgId: string,
    options: { role?: string; page?: number; limit?: number } = {},
    userId?: string
  ) => {
    try {
      if (userId) {
        await this.checkPermission(userId, 'employee:read');
      }
      return await employeeRepository.list(orgId, {
        role: options.role,
        page: options.page,
        limit: options.limit,
      });
    } catch (error) {
      this.logger.error('Failed to list employees', error);
      throw getTRPCError(error);
    }
  };

  delete = async (id: string, orgId: string, userId?: string) => {
    try {
      if (userId) {
        await this.checkPermission(userId, 'employee:delete');
      }
      await employeeRepository.delete(id, orgId);
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      this.logger.error('Failed to delete employee', error);
      throw getTRPCError(error);
    }
  };

  analytics = async (orgId: string, userId?: string) => {
    try {
      if (userId) {
        await this.checkPermission(userId, 'reports:read');
      }
      return await employeeRepository.analytics(orgId);
    } catch (error) {
      this.logger.error('Failed to get employee analytics', error);
      throw getTRPCError(error);
    }
  };

  updateAvatar = async ({ input }: UpdateAvatarArgs) => {
    return employeeRepository.updateAvatar(input.employeeId, input.avatar);
  };

  deleteAvatar = async ({ input }: DeleteAvatarArgs) => {
    const doc = await employeeRepository.deleteAvatar(input.employeeId);
    const fileId = doc.avatar?.fileId;
    if (fileId) {
      // delete file from imagekit
      await deleteFileFromImageKit(fileId);
    }
    return {
      data: {
        id: doc.id,
      },
      message: 'Avatar deleted successfully',
    };
  };

  getReportingManagers = async (orgId: string) => {
    try {
      return await employeeRepository.getReportingManagers(orgId);
    } catch (error) {
      this.logger.error('Failed to get reporting managers', error);
      throw getTRPCError(error);
    }
  };

  changePassword = async (
    id: string,
    orgId: string,
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await employeeRepository.changePassword(id, orgId, currentPassword, newPassword);
      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error('Failed to change employee password', error);
      throw getTRPCError(error);
    }
  };

  // Placeholder methods for features that need additional models/implementation
  getPaySlips = async (_employeeCode: string, _orgId: string) => {
    // TODO: Implement when PaySlip model is available
    return [];
  };

  getPaySlipById = async (_employeeCode: string, _paySlipId: string, _orgId: string) => {
    // TODO: Implement when PaySlip model is available
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'PaySlip functionality not yet implemented',
    });
  };

  getAttendance = async (_employeeCode: string, _orgId: string) => {
    // TODO: Implement when TimeLog model is properly integrated
    return [];
  };

  updatePayroll = async (_employeeCode: string, _orgId: string, _payrollData: unknown) => {
    // TODO: Implement when payroll structure is defined
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'Payroll functionality not yet implemented',
    });
  };

  updateLeaves = async (_employeeCode: string, _orgId: string, _leaveData: unknown) => {
    // TODO: Implement when leave management structure is defined
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'Leave management functionality not yet implemented',
    });
  };

  bulkUpdate = async (_employeeCodes: string[], _orgId: string, _data: unknown) => {
    // TODO: Implement bulk operations
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'Bulk update functionality not yet implemented',
    });
  };

  getByEmail = async (email: string, orgId: string) => {
    try {
      const data = await employeeRepository.getByEmail(email, orgId);
      return data;
    } catch (error) {
      this.logger.error('Failed to get employee by email', error);
      throw getTRPCError(error);
    }
  };

  getByEmployeeCode = async (employeeCode: string, orgId: string) => {
    try {
      const data = await employeeRepository.getByEmployeeCode(employeeCode, orgId);
      return data;
    } catch (error) {
      this.logger.error('Failed to get employee by employee code', error);
      throw getTRPCError(error);
    }
  };
}

export const employeeService = new EmployeeService();
