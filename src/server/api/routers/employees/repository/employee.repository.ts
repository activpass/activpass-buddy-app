import { TRPCError } from '@trpc/server';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { type FilterQuery } from 'mongoose';

import { generateEmployeeCode, generateMongooseObjectId } from '@/server/api/helpers/common';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger';
import { userProviderSchema } from '@/validations/auth.validation';
import { DEFAULT_SYSTEM_ROLE_KEY } from '@/validations/role.validation';
import { UserTypeEnum } from '@/validations/user/add-form.validation';

import { roleRepository } from '../../role/repository/role.repository';
import { TimeLogModel } from '../../time-log/model/time-log.model';
import {
  type IUserBaseSchema,
  type IUserData,
  type IUserDocument,
  UserModel,
} from '../../user/model/user.model';
import type { CreateEmployeeInputSchema, UpdateEmployeeInputSchema } from '../employee.input';

// Type for populated role
interface IPopulatedRole {
  id: string;
  name: string;
  key: string;
  description?: string;
  level?: number;
  type?: string;
}

class EmployeeRepository {
  private readonly logger = new Logger(EmployeeRepository.name);

  getById = async (id: string): Promise<IUserDocument> => {
    try {
      const employee = await UserModel.findById(id)
        .populate('role', 'name key description level type')
        .exec();

      if (!employee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Employee not found',
        });
      }

      return employee;
    } catch (error) {
      this.logger.error('Failed to get employee by id', error);
      throw error;
    }
  };

  findByEmail = async (orgId: string, email: string): Promise<IUserDocument | null> => {
    try {
      return await UserModel.findOne({
        email,
        organization: orgId,
      })
        .populate('role', 'name key description level type')
        .exec();
    } catch (error) {
      this.logger.error('Failed to find employee by email', error);
      throw error;
    }
  };

  isEmployeeExists = async (orgId: string, email: string, phoneNumber?: number): Promise<void> => {
    try {
      const query: FilterQuery<IUserDocument> = {
        organization: orgId,
        email,
      };

      if (phoneNumber) {
        query.$or = [{ email }, { phoneNumber }];
        delete query.email;
      }

      const existingEmployee = await UserModel.findOne(query).exec();

      if (existingEmployee) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Employee with this email${phoneNumber ? ' or phone number' : ''} already exists in this organization.`,
        });
      }
    } catch (error) {
      this.logger.error('Failed to check if employee exists', error);
      throw error;
    }
  };

  create = async (input: CreateEmployeeInputSchema, orgId: string): Promise<IUserDocument> => {
    try {
      await this.isEmployeeExists(orgId, input.email, input.phoneNumber);
      const roleResult = await roleRepository.getByKey(DEFAULT_SYSTEM_ROLE_KEY.EMPLOYEE);
      if (!roleResult.success || !roleResult.data) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Role '${input.role}' not found`,
        });
      }
      const role = roleResult.data;
      const employeeCode = generateEmployeeCode();

      const userData = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phoneNumber: input.phoneNumber,
        organization: generateMongooseObjectId(orgId),
        role: role._id,
        provider: userProviderSchema.enum.email,
        verified: true,
        uniqueCode: employeeCode,
        type: UserTypeEnum.EMPLOYEE,

        // Employee-specific fields
        gender: input.gender,
        dob: input.dob,
        address: input.address,
        emergencyContact: input.emergencyContact,
        bank: input.bank,
        jobDetails: input.jobDetails,
        workSchedule: input.workSchedule,
        payroll: input.payroll,
        leaves: input.leaves || {
          casual: { total: 12, used: 0 },
          medical: { total: 12, used: 0 },
          earned: { total: 0, used: 0 },
        },
        notificationPreferences: input.notificationPreferences || {
          email: false,
          all: false,
          client: false,
          employee: false,
          finance: false,
          membership: false,
          isTwoFactorAuthEnabled: false,
          isEmailRecoveryEnabled: false,
          isMobileNumberRecoveryEnabled: false,
        },
        isDeleted: false,
      };

      const user = new UserModel(userData);

      // Set password if provided
      // if (input.password) {
      //   user.set('password', input.password);
      // }

      await user.save();

      // Populate the role before returning
      await user.populate<{ role: IPopulatedRole }>('role', 'name key description level type');

      return user;
    } catch (error) {
      this.logger.error('Failed to create employee', error);
      throw error;
    }
  };

  update = async (
    id: string,
    data: UpdateEmployeeInputSchema['data'] & {
      checkInDate?: IUserBaseSchema['checkInDate'];
      checkOutDate?: IUserBaseSchema['checkOutDate'];
    },
    orgId: string
  ): Promise<IUserDocument> => {
    try {
      // Check if employee exists and belongs to the organization
      const existingEmployee = await UserModel.findOne({
        _id: id,
        organization: orgId,
        isDeleted: { $ne: true },
      }).exec();

      if (!existingEmployee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Employee not found',
        });
      }

      // Prepare update data including employee-specific fields
      const updateData: Record<string, unknown> = {};

      // Basic fields
      if (data.firstName) updateData.firstName = data.firstName;
      if (data.lastName) updateData.lastName = data.lastName;
      if (data.email) updateData.email = data.email;
      if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;

      // Employee-specific fields
      if (data.gender) updateData.gender = data.gender;
      if (data.dob) updateData.dob = data.dob;
      if (data.address) updateData.address = data.address;
      if (data.emergencyContact) updateData.emergencyContact = data.emergencyContact;
      if (data.bank) updateData.bank = data.bank;
      if (data.jobDetails) updateData.jobDetails = data.jobDetails;
      if (data.workSchedule) updateData.workSchedule = data.workSchedule;
      if (data.payroll) updateData.payroll = data.payroll;
      if (data.leaves) updateData.leaves = data.leaves;
      if (data.notificationPreferences)
        updateData.notificationPreferences = data.notificationPreferences;

      if (data.checkInDate) updateData.checkInDate = data.checkInDate;
      if (data.checkOutDate) updateData.checkOutDate = data.checkOutDate;

      const updatedEmployee = await UserModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate([
          {
            path: 'jobDetails.reportTo',
            select: 'firstName lastName email',
          },
          {
            path: 'role',
            select: 'name key description level type',
          },
        ])
        .exec();

      if (!updatedEmployee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Employee not found',
        });
      }

      return updatedEmployee;
    } catch (error) {
      this.logger.error('Failed to update employee', error);
      throw error;
    }
  };

  list = async (
    orgId: string,
    options: { role?: string; page?: number; limit?: number; search?: string } = {}
  ) => {
    try {
      const { page = 1, limit = 10, search } = options;

      const query: FilterQuery<IUserData> = {
        organization: orgId,
        type: UserTypeEnum.EMPLOYEE,
        isDeleted: { $ne: true },
      };

      // Add search functionality
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { uniqueCode: { $regex: search, $options: 'i' } },
          { designation: { $regex: search, $options: 'i' } },
          { 'jobDetails.department': { $regex: search, $options: 'i' } },
        ];
      }

      const [employees, total] = await Promise.all([
        UserModel.find(query)
          .select(
            'firstName lastName email phoneNumber role uniqueCode designation gender dob address emergencyContact bank jobDetails workSchedule payroll leaves createdAt checkInDate isDeleted'
          )
          .populate<{ role: IPopulatedRole }>('role', 'id name key description level type')
          .limit(limit)
          .skip((page - 1) * limit)
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        UserModel.countDocuments(query).exec(),
      ]);

      return {
        employees: employees.map(employee => ({
          id: employee._id.toString(),
          firstName: employee.firstName,
          lastName: employee.lastName,
          fullName: `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          employeeCode: employee.uniqueCode,
          designation: employee.designation,
          gender: employee.gender,
          dob: employee.dob,
          address: employee.address,
          emergencyContact: employee.emergencyContact,
          bank: employee.bank,
          checkInDate: employee.checkInDate,
          jobDetails: employee.jobDetails,
          workSchedule: employee.workSchedule,
          payroll: employee.payroll,
          leaves: employee.leaves,
          role: employee.role,
          joiningDate: employee.createdAt,
          status: employee.isDeleted ? 'inactive' : 'active',
          isNew: employee.createdAt >= new Date(new Date().setDate(new Date().getDate() - 7)), // New if created within last 7 days
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      this.logger.error('Failed to list employees', error);
      throw error;
    }
  };

  delete = async (id: string, orgId: string): Promise<void> => {
    try {
      const employee = await UserModel.findOne({
        _id: id,
        organization: orgId,
        isDeleted: { $ne: true },
      }).exec();

      if (!employee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Employee not found',
        });
      }

      // Soft delete instead of hard delete
      await UserModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true }).exec();
    } catch (error) {
      this.logger.error('Failed to delete employee', error);
      throw error;
    }
  };

  analytics = async (orgId: string) => {
    try {
      const commonQuery: FilterQuery<IUserData> = {
        organization: generateMongooseObjectId(orgId),
        isDeleted: { $ne: true },
        type: UserTypeEnum.EMPLOYEE, // Ensure only employees are counted
      };
      // Total employees in the organization (excluding deleted)
      const totalEmployeeCount = await UserModel.countDocuments(commonQuery).exec();

      // Department-wise analytics
      const departmentAnalytics = await UserModel.aggregate([
        {
          $match: commonQuery,
        },
        {
          $group: {
            _id: '$jobDetails.department',
            count: { $sum: 1 },
            employees: {
              $push: {
                id: '$_id',
                firstName: '$firstName',
                lastName: '$lastName',
                designation: '$designation',
              },
            },
          },
        },
        {
          $project: {
            department: { $ifNull: ['$_id', 'Unassigned'] },
            count: 1,
            employees: 1,
            _id: 0,
          },
        },
      ]).exec();

      // Gender distribution
      const genderDistribution = await UserModel.aggregate([
        {
          $match: commonQuery,
        },
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            gender: { $ifNull: ['$_id', 'Not specified'] },
            count: 1,
            _id: 0,
          },
        },
      ]).exec();

      // Calculate estimated salary from payroll data
      const salaryStats = await UserModel.aggregate([
        {
          $match: {
            ...commonQuery,
            'payroll.grossSalary': { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            totalSalary: { $sum: { $toDouble: '$payroll.grossSalary' } },
            avgSalary: { $avg: { $toDouble: '$payroll.grossSalary' } },
            count: { $sum: 1 },
          },
        },
      ]).exec();

      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(monthStart);

      // New employees this month
      const currentMonthTotalEmployees = await UserModel.aggregate([
        {
          $match: {
            ...commonQuery,
            createdAt: {
              $gte: monthStart,
              $lt: monthEnd,
            },
          },
        },
        {
          $count: 'newAddedCount',
        },
      ]).exec();

      const startDate = startOfDay(new Date());
      const endDate = endOfDay(startDate);

      // Present employees today (would need TimeLog integration)
      const currentDatePresentCounts = await TimeLogModel.aggregate([
        {
          $match: {
            organization: generateMongooseObjectId(orgId),
            employee: { $ne: null },
            checkIn: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $count: 'presentCount',
        },
      ]).exec();

      let presentCount = 0;
      let absentCount = 0;
      if (currentDatePresentCounts.length > 0) {
        presentCount = currentDatePresentCounts[0].presentCount;
      }

      absentCount = totalEmployeeCount - presentCount;

      return {
        totalEmployeeCount,
        newEmployeesThisMonth:
          currentMonthTotalEmployees.length > 0 ? currentMonthTotalEmployees[0].newAddedCount : 0,
        presentCount,
        absentCount,
        estimatedSalary: salaryStats[0]?.totalSalary || 0,
        averageSalary: salaryStats[0]?.avgSalary || 0,
        departmentWise: departmentAnalytics,
        genderDistribution,
        employeesWithSalaryData: salaryStats[0]?.count || 0,
      };
    } catch (error) {
      this.logger.error('Failed to get employee analytics', error);
      throw error;
    }
  };

  getReportingManagers = async (orgId: string) => {
    try {
      const managers = await UserModel.find({
        organization: orgId,
        isDeleted: { $ne: true },
        role: { $ne: 'USER' }, // Exclude regular users
      })
        .select('firstName lastName email role designation jobDetails')
        .populate<{ role: IPopulatedRole }>('role', 'name key description level type')
        .exec();

      return managers.map(manager => ({
        id: manager._id.toString(),
        firstName: manager.firstName,
        lastName: manager.lastName,
        fullName: `${manager.firstName || ''} ${manager.lastName || ''}`.trim(),
        email: manager.email,
        designation: manager.designation,
        department: manager.jobDetails?.department,
        role: manager.role,
      }));
    } catch (error) {
      this.logger.error('Failed to get reporting managers', error);
      throw error;
    }
  };

  changePassword = async (
    id: string,
    orgId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const employee = await UserModel.findOne({
        _id: id,
        organization: orgId,
        isDeleted: { $ne: true },
      }).exec();

      if (!employee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Employee not found',
        });
      }

      await UserModel.changePassword(id, oldPassword, newPassword);
    } catch (error) {
      this.logger.error('Failed to change employee password', error);
      throw error;
    }
  };

  // Additional employee-specific methods

  findByEmployeeCode = async (
    orgId: string,
    employeeCode: string
  ): Promise<IUserDocument | null> => {
    try {
      return await UserModel.findOne({
        uniqueCode: employeeCode,
        organization: orgId,
        isDeleted: { $ne: true },
      })
        .populate('role', 'name key description level type')
        .exec();
    } catch (error) {
      this.logger.error('Failed to find employee by employee code', error);
      throw error;
    }
  };

  findByDepartment = async (orgId: string, department: string) => {
    try {
      return await UserModel.find({
        organization: orgId,
        'jobDetails.department': department,
        isDeleted: { $ne: true },
      })
        .select('firstName lastName email uniqueCode designation jobDetails role')
        .populate([
          {
            path: 'jobDetails.reportTo',
            select: 'firstName lastName email',
          },
          {
            path: 'role',
            select: 'name key description level type',
          },
        ])
        .exec();
    } catch (error) {
      this.logger.error('Failed to find employees by department', error);
      throw error;
    }
  };

  updateLeaves = async (
    id: string,
    orgId: string,
    leaveType: 'casual' | 'medical' | 'earned',
    action: 'add' | 'subtract',
    days: number
  ) => {
    try {
      const employee = await UserModel.findOne({
        _id: id,
        organization: orgId,
        isDeleted: { $ne: true },
      }).exec();

      if (!employee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Employee not found',
        });
      }

      const updateField =
        action === 'add' ? `leaves.${leaveType}.used` : `leaves.${leaveType}.total`;
      const updateValue =
        action === 'add' ? { $inc: { [updateField]: days } } : { $inc: { [updateField]: days } };

      return await UserModel.findByIdAndUpdate(id, updateValue, {
        new: true,
        runValidators: true,
      }).exec();
    } catch (error) {
      this.logger.error('Failed to update employee leaves', error);
      throw error;
    }
  };

  getByEmail = async (email: string, orgId: string): Promise<IUserDocument | null> => {
    try {
      return await UserModel.findByEmail(email, orgId);
    } catch (error) {
      this.logger.error('Failed to get employee by email', error);
      throw error;
    }
  };

  findByPhoneNumber = async (orgId: string, phoneNumber: number) => {
    try {
      const doc = await UserModel.findByPhoneNumber(phoneNumber, orgId);
      return doc;
    } catch (error) {
      this.logger.error('Failed to find employee by phone number', error);
      throw error;
    }
  };

  getByEmployeeCode = async (
    employeeCode: string,
    orgId?: string
  ): Promise<IUserDocument | null> => {
    try {
      const query: FilterQuery<IUserDocument> = {
        uniqueCode: employeeCode,
        isDeleted: { $ne: true },
      };

      if (orgId) {
        query.organization = orgId;
      }
      return await UserModel.findOne(query).exec();
    } catch (error) {
      this.logger.error('Failed to get employee by employee code', error);
      throw error;
    }
  };

  updateAvatar = async (id: string, avatar: IUserBaseSchema['avatar']) => {
    try {
      const updatedDoc = await UserModel.findByIdAndUpdate(
        id,
        {
          avatar,
        },
        { new: true }
      ).exec();
      if (!updatedDoc) {
        throw getTRPCError('Employee not found', 'NOT_FOUND');
      }
      return updatedDoc;
    } catch (error) {
      this.logger.error('Failed to update employee avatar', error);
      throw error;
    }
  };

  deleteAvatar = async (id: string) => {
    try {
      const updatedDoc = await UserModel.findByIdAndUpdate(
        id,
        {
          avatar: null,
        },
        { new: false }
      ).exec();
      if (!updatedDoc) {
        throw getTRPCError('Employee not found', 'NOT_FOUND');
      }
      return updatedDoc;
    } catch (error) {
      this.logger.error('Failed to delete employee avatar', error);
      throw error;
    }
  };
}

export const employeeRepository = new EmployeeRepository();
