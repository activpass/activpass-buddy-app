import type { FilterQuery, MongooseError } from 'mongoose';

import {
  calculateExpirationDate,
  generateOnboardingToken,
} from '../helper/onboard-employee.helper';
import { OnboardEmployeeModel } from '../model/onboard-employee.model';
import type {
  IOnboardEmployeeBase,
  IOnboardEmployeeDocument,
  IOnboardEmployeePaginationResult,
  IOnboardEmployeeStatistics,
  PopulatedOnboardEmployeeDocument,
} from '../model/onboard-employee.model.types';
import {
  OnboardEmployeeExpiredError,
  OnboardEmployeeNotFoundError,
  OnboardEmployeeValidationError,
} from '../model/onboard-employee.model.types';
import type {
  IOnboardEmployeeFilter,
  IOnboardEmployeeUpdate,
  OnboardEmployeeStatus,
} from '../onboard-employee.input';

export class OnboardEmployeeRepository {
  /**
   * Create a new employee onboarding record
   */
  static async create(data: Partial<IOnboardEmployeeBase>): Promise<IOnboardEmployeeDocument> {
    try {
      return await OnboardEmployeeModel.createOnboarding(data);
    } catch (err) {
      const error = err as { code?: number } & MongooseError;
      if (error.code === 11000) {
        throw new OnboardEmployeeValidationError(
          'An onboarding record with this token already exists',
          'DUPLICATE_TOKEN'
        );
      }
      throw error;
    }
  }

  /**
   * Find onboarding record by ID
   */
  static async findById(id: string): Promise<IOnboardEmployeeDocument | null> {
    return OnboardEmployeeModel.findById(id)
      .populate('organization', 'name')
      .populate('createdBy', 'firstName lastName email')
      .exec();
  }

  /**
   * Get onboarding record by ID (throws if not found)
   */
  static async getById(id: string): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.findById(id);
    if (!onboarding) {
      throw new OnboardEmployeeNotFoundError(id);
    }
    return onboarding;
  }

  /**
   * Find onboarding record by token
   */
  static async findByToken(token: string) {
    return OnboardEmployeeModel.findByToken(token);
  }

  /**
   * Get onboarding record by token (throws if not found)
   */
  static async getByToken(token: string) {
    const onboarding = await this.findByToken(token);
    if (!onboarding) {
      throw new OnboardEmployeeNotFoundError(`token: ${token}`);
    }
    return onboarding;
  }

  /**
   * Find onboarding records by user
   */
  static async findByUser(
    userId: string,
    organizationId?: string
  ): Promise<IOnboardEmployeeDocument[]> {
    return OnboardEmployeeModel.findByUser(userId, organizationId);
  }

  /**
   * Find onboarding records with pagination and filtering
   */
  static async findWithPagination(
    filter: IOnboardEmployeeFilter
  ): Promise<IOnboardEmployeePaginationResult> {
    return OnboardEmployeeModel.findWithPagination(filter);
  }

  /**
   * Update onboarding record
   */
  static async update(
    id: string,
    data: Partial<IOnboardEmployeeUpdate>
  ): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.getById(id);

    Object.assign(onboarding, data);

    return onboarding.save();
  }

  /**
   * Delete onboarding record
   */
  static async delete(id: string): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.getById(id);
    await OnboardEmployeeModel.findByIdAndDelete(id);
    return onboarding;
  }

  /**
   * Verify employee onboarding token
   */
  static async verifyToken(token: string) {
    const onboarding = await this.getByToken(token);

    if (onboarding.verified) {
      return onboarding;
    }

    if (onboarding.isExpired) {
      throw new OnboardEmployeeExpiredError();
    }

    return (await onboarding.verify()).populate<
      Pick<PopulatedOnboardEmployeeDocument, 'organization'>
    >('organization', 'name type');
  }

  /**
   * Complete employee onboarding
   */
  static async complete(token: string) {
    const onboarding = await this.getByToken(token);

    if (onboarding.onBoarded) {
      return onboarding;
    }

    return onboarding.complete();
  }

  /**
   * Cancel employee onboarding
   */
  static async cancel(id: string): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.getById(id);
    return onboarding.cancel();
  }

  /**
   * Extend onboarding expiry
   */
  static async extendExpiry(
    id: string,
    additionalDays: number = 7
  ): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.getById(id);
    return onboarding.extendExpiry(additionalDays);
  }

  /**
   * Send reminder for onboarding
   */
  static async sendReminder(id: string): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.getById(id);

    if (!onboarding.canSendReminder()) {
      throw new OnboardEmployeeValidationError(
        'Cannot send reminder for this onboarding',
        'REMINDER_NOT_ALLOWED'
      );
    }

    return onboarding.sendReminder();
  }

  /**
   * Update checklist item
   */
  static async updateChecklist(
    id: string,
    checklistItem: string,
    completed: boolean
  ): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.getById(id);
    return onboarding.updateChecklist(checklistItem, completed);
  }

  /**
   * Generate new onboarding token
   */
  static async regenerateToken(id: string): Promise<IOnboardEmployeeDocument> {
    const onboarding = await this.getById(id);

    onboarding.token = generateOnboardingToken();
    onboarding.expiresAt = calculateExpirationDate(7);
    onboarding.status = 'PENDING';
    onboarding.verified = false;
    onboarding.verifiedAt = undefined;
    onboarding.remindersSent = 0;
    onboarding.lastReminderSent = undefined;

    return onboarding.save();
  }

  /**
   * Find expired onboarding records
   */
  static async findExpired(): Promise<IOnboardEmployeeDocument[]> {
    return OnboardEmployeeModel.findExpired();
  }

  /**
   * Find onboarding records expiring soon
   */
  static async findExpiringSoon(hours: number = 24): Promise<IOnboardEmployeeDocument[]> {
    return OnboardEmployeeModel.findExpiringSoon(hours);
  }

  /**
   * Find pending reminders
   */
  static async findPendingReminders(): Promise<IOnboardEmployeeDocument[]> {
    return OnboardEmployeeModel.findPendingReminders();
  }

  /**
   * Mark expired onboarding records
   */
  static async markExpiredRecords(): Promise<number> {
    const expiredRecords = await this.findExpired();

    if (expiredRecords.length === 0) {
      return 0;
    }

    const expiredIds = expiredRecords.map(record => record._id.toString());

    await OnboardEmployeeModel.bulkUpdateStatus(expiredIds, 'EXPIRED');

    return expiredRecords.length;
  }

  /**
   * Bulk operations
   */
  static async bulkCancel(onboardingIds: string[]): Promise<void> {
    await OnboardEmployeeModel.bulkUpdateStatus(onboardingIds, 'CANCELLED');
  }

  static async bulkExtendExpiry(
    onboardingIds: string[],
    additionalDays: number = 7
  ): Promise<void> {
    await OnboardEmployeeModel.bulkExtendExpiry(onboardingIds, additionalDays);
  }

  static async bulkDelete(onboardingIds: string[]): Promise<void> {
    await OnboardEmployeeModel.deleteMany({ _id: { $in: onboardingIds } });
  }

  /**
   * Get statistics
   */
  static async getStatistics(organizationId?: string): Promise<IOnboardEmployeeStatistics> {
    return OnboardEmployeeModel.getStatistics(organizationId);
  }

  /**
   * Find by organization
   */
  static async findByOrganization(
    organizationId: string,
    filter: Partial<IOnboardEmployeeFilter> = {}
  ): Promise<IOnboardEmployeePaginationResult> {
    const organizationFilter: IOnboardEmployeeFilter = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filter,
      organizationId,
    };

    return this.findWithPagination(organizationFilter);
  }

  /**
   * Find by status
   */
  static async findByStatus(
    status: OnboardEmployeeStatus,
    organizationId?: string
  ): Promise<IOnboardEmployeeDocument[]> {
    const query: FilterQuery<IOnboardEmployeeBase> = { status };
    if (organizationId) {
      query.organization = organizationId;
    }

    return OnboardEmployeeModel.find(query)
      .populate('organization', 'name')
      .populate('user', 'firstName lastName email')
      .populate('assignedRole', 'name key')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Count records by status
   */
  static async countByStatus(
    status: OnboardEmployeeStatus,
    organizationId?: string
  ): Promise<number> {
    const query: FilterQuery<IOnboardEmployeeBase> = { status };
    if (organizationId) {
      query.organization = organizationId;
    }

    return OnboardEmployeeModel.countDocuments(query);
  }

  /**
   * Find records created by user
   */
  static async findByCreator(
    createdById: string,
    filter: Partial<IOnboardEmployeeFilter> = {}
  ): Promise<IOnboardEmployeePaginationResult> {
    const creatorFilter: IOnboardEmployeeFilter = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filter,
      createdById,
    };

    return this.findWithPagination(creatorFilter);
  }

  /**
   * Find records by manager
   */
  static async findByManager(
    managerId: string,
    filter: Partial<IOnboardEmployeeFilter> = {}
  ): Promise<IOnboardEmployeePaginationResult> {
    const managerFilter: IOnboardEmployeeFilter = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filter,
      managerId,
    };

    return this.findWithPagination(managerFilter);
  }

  /**
   * Find records by department
   */
  static async findByDepartment(
    department: string,
    organizationId?: string,
    filter: Partial<IOnboardEmployeeFilter> = {}
  ): Promise<IOnboardEmployeePaginationResult> {
    const departmentFilter: IOnboardEmployeeFilter = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filter,
      department,
      organizationId,
    };

    return this.findWithPagination(departmentFilter);
  }

  /**
   * Check if user has pending onboarding
   */
  static async hasPendingOnboarding(userId: string, organizationId?: string): Promise<boolean> {
    const query: FilterQuery<IOnboardEmployeeBase> = {
      user: userId,
      status: { $in: ['PENDING', 'IN_PROGRESS'] },
      expiresAt: { $gt: new Date() },
    };

    if (organizationId) {
      query.organization = organizationId;
    }

    const count = await OnboardEmployeeModel.countDocuments(query);
    return count > 0;
  }

  /**
   * Get recent onboarding activity
   */
  static async getRecentActivity(
    organizationId?: string,
    limit: number = 10
  ): Promise<IOnboardEmployeeDocument[]> {
    const query: FilterQuery<IOnboardEmployeeBase> = {};
    if (organizationId) {
      query.organization = organizationId;
    }

    return OnboardEmployeeModel.find(query)
      .populate('organization', 'name')
      .populate('user', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Search onboarding records
   */
  static async search(
    searchTerm: string,
    organizationId?: string,
    filter: Partial<IOnboardEmployeeFilter> = {}
  ): Promise<IOnboardEmployeePaginationResult> {
    const searchFilter: IOnboardEmployeeFilter = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filter,
      search: searchTerm,
      organizationId,
    };

    return this.findWithPagination(searchFilter);
  }
}
